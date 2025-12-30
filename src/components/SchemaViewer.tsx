import React, { useEffect, useState } from 'react';
import { bitable, type ITableMeta, type IFieldMeta, type IRecord } from '@lark-base-open/js-sdk';
import { Tree, Typography, Spin, Alert, Button, message, Tooltip } from 'antd';
import { 
  FolderOpenOutlined, 
  FolderOutlined, 
  ExportOutlined 
} from '@ant-design/icons';
import { mapLarkTypeToSQL, getFieldIcon } from '../utils/larkTypes';
import type { DataNode } from 'antd/es/tree';

const { Text } = Typography;

interface TableData {
  meta: ITableMeta;
  fields: IFieldMeta[];
  records: IRecord[];
  loading: boolean;
}

const SchemaViewer: React.FC = () => {
  const [tablesData, setTablesData] = useState<Map<string, TableData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tableMetaList = await bitable.base.getTableMetaList();
        
        const newTablesData = new Map<string, TableData>();
        tableMetaList.forEach(meta => {
          newTablesData.set(meta.id, {
            meta,
            fields: [],
            records: [],
            loading: true
          });
        });
        setTablesData(new Map(newTablesData));

        // Expand the first table by default
        if (tableMetaList.length > 0) {
          setExpandedKeys([tableMetaList[0].id]);
        }

        await Promise.all(tableMetaList.map(async (meta) => {
          try {
            const table = await bitable.base.getTable(meta.id);
            const fields = await table.getFieldMetaList();
            // Fetch a few records for export/preview if needed, though we only show schema in tree
            const recordList = await table.getRecords({ pageSize: 10 });
            
            setTablesData(prev => {
              const next = new Map(prev);
              next.set(meta.id, {
                meta,
                fields,
                records: recordList.records,
                loading: false
              });
              return next;
            });
          } catch (err) {
            console.error(`Error fetching data for table ${meta.name}:`, err);
          }
        }));
      } catch (err) {
        console.error("Failed to fetch tables:", err);
        setError("Failed to load Base data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = async () => {
    let exportText = '';
    tablesData.forEach(({ meta, fields, records }) => {
      exportText += `TABLE: ${meta.name} (${meta.id})\n`;
      exportText += `SCHEMA:\n`;
      fields.forEach(f => {
        exportText += `  - ${f.name}: ${mapLarkTypeToSQL(f.type)}\n`;
      });
      exportText += `PREVIEW DATA (${records.length} rows):\n`;
      records.forEach(r => {
        const rowData = fields.map(f => {
          const val = r.fields[f.id];
          if (val === null || val === undefined) return 'NULL';

          // Helper to extract text from various Lark value structures
          const extractText = (value: any): string => {
            if (Array.isArray(value)) {
              // Handle array of objects (e.g., Links, Lookups, MultiSelect)
              // Map each item to its text representation and join
              return value.map(item => {
                if (typeof item === 'object') {
                  return `"${item.text || item.name || item.id || JSON.stringify(item)}"`;
                }
                return `"${String(item)}"`;
              }).join(', ');
            } else if (typeof value === 'object') {
               // Handle single objects (e.g. SingleSelect, User)
               return `"${value.text || value.name || value.id || JSON.stringify(value)}"`;
            }
            // Simple primitives
            return String(value);
          };

          return extractText(val);
        }).join(' | ');
        exportText += `  ${rowData}\n`;
      });
      exportText += '\n' + '-'.repeat(40) + '\n\n';
    });

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(exportText);
        message.success('Schema and preview data copied to clipboard!');
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
      // Fallback method
      const textarea = document.createElement('textarea');
      textarea.value = exportText;
      textarea.style.position = 'fixed'; // Avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          message.success('Schema and preview data copied to clipboard!');
        } else {
          message.error('Failed to copy to clipboard');
        }
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        message.error('Failed to copy. Please manually select and copy if displayed.');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    const key = selectedKeys[0] as string;
    if (!key) return;

    // Check if it's a table (top level) or field
    const isTable = tablesData.has(key);
    let tableId = isTable ? key : info.node.tableId;

    if (tableId) {
      // Construct URL
      // Pattern: https://intchains.feishu.cn/wiki/...?table={tableId}
      // Since we are inside the app, opening a new tab to the same base with query param might work
      // or we try to find the current base URL.
      // Fallback: use a generic Lark Base URL structure if specific wiki URL is unknown, 
      // but user gave a specific wiki link. We will try to use relative path if possible or absolute.
      
      // Attempt to get current URL context if possible, otherwise use the hardcoded base for this user 
      // or a generic one. User asked to "direct to that table".
      
      const baseUrl = 'https://intchains.feishu.cn/wiki/MNOkwgTt1i1aX7kmvTNc0161nUI';
      const targetUrl = `${baseUrl}?table=${tableId}`;
      window.open(targetUrl, '_blank');
    }
  };

  const treeData: DataNode[] = Array.from(tablesData.values()).map(({ meta, fields }) => ({
    title: <Text strong>{meta.name}</Text>,
    key: meta.id,
    icon: (props: any) => props.expanded ? <FolderOpenOutlined /> : <FolderOutlined />,
    children: fields.map(field => ({
      title: (
        <span>
          <Text>{field.name}</Text>
          <span style={{ 
            marginLeft: 8, 
            fontSize: 10, 
            color: '#8c8c8c', 
            background: '#f5f5f5', 
            padding: '2px 6px', 
            borderRadius: 4,
            border: '1px solid #d9d9d9'
          }}>
            {mapLarkTypeToSQL(field.type)}
          </span>
        </span>
      ),
      key: `${meta.id}-${field.id}`,
      icon: getFieldIcon(field.type),
      isLeaf: true,
      tableId: meta.id // Custom prop for navigation
    }))
  }));

  if (loading && tablesData.size === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ 
        flex: '0 0 auto',
        padding: '8px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fafafa'
      }}>
        <Text type="secondary" style={{ fontSize: 12 }}>EXPLORER</Text>
        <Tooltip title="Copy Schema to Clipboard">
          <Button 
            type="text" 
            size="small" 
            icon={<ExportOutlined />} 
            onClick={handleExport} 
          />
        </Tooltip>
      </div>
      
      <div style={{ flex: '1 1 auto', overflow: 'auto', padding: '8px 0' }}>
        <Tree
          showIcon
          blockNode
          onSelect={handleSelect}
          onExpand={setExpandedKeys}
          expandedKeys={expandedKeys}
          treeData={treeData}
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  );
};

export default SchemaViewer;
