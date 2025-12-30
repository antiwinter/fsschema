import React, { useEffect, useState } from 'react';
import { bitable, type ITableMeta, type IFieldMeta, type IRecord, FieldType } from '@lark-base-open/js-sdk';
import { Table, Typography, Spin, Collapse, Tag, Tabs, Empty, Alert } from 'antd';
import { mapLarkTypeToSQL } from '../utils/larkTypes';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all tables
        const tableMetaList = await bitable.base.getTableMetaList();
        
        const newTablesData = new Map<string, TableData>();

        // Initialize map with table metadata
        tableMetaList.forEach(meta => {
          newTablesData.set(meta.id, {
            meta,
            fields: [],
            records: [],
            loading: true
          });
        });
        setTablesData(new Map(newTablesData)); // Trigger update

        // Fetch details for each table in parallel
        await Promise.all(tableMetaList.map(async (meta) => {
          try {
            const table = await bitable.base.getTable(meta.id);
            const fields = await table.getFieldMetaList();
            
            // Get records (limit 10)
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
        setError("Failed to load Base data. Please ensure this app is running inside Lark Base.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && tablesData.size === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading Schema..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const items = Array.from(tablesData.values()).map(({ meta, fields, records }) => {
    // Schema Table Columns
    const schemaColumns = [
      {
        title: 'Field Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <Text strong>{text}</Text>,
      },
      {
        title: 'SQL Type',
        dataIndex: 'type',
        key: 'type',
        render: (type: FieldType) => <Tag color="blue">{mapLarkTypeToSQL(type)}</Tag>,
      },
      {
        title: 'Original Type ID',
        dataIndex: 'type',
        key: 'originalType',
        render: (type: number) => <Text type="secondary" style={{ fontSize: '12px' }}>{type}</Text>,
      },
    ];

    // Data Preview Columns
    // We construct columns dynamically from fields
    const previewColumns = fields.map(field => ({
      title: field.name,
      dataIndex: ['fields', field.id],
      key: field.id,
      render: (value: any) => {
        // Simple renderer for various field types
        if (value === null || value === undefined) return <Text type="secondary">NULL</Text>;
        
        if (typeof value === 'object') {
           // Handle complex types like arrays (MultiSelect, User) or objects (SingleSelect, Link)
           if (Array.isArray(value)) {
             return value.map((v: any) => v.text || v.name || JSON.stringify(v)).join(', ');
           }
           return value.text || value.name || JSON.stringify(value);
        }
        return String(value);
      },
      width: 150,
      ellipsis: true,
    }));

    return {
      key: meta.id,
      label: <span style={{ fontWeight: 600 }}>{meta.name}</span>,
      children: (
        <Tabs
          defaultActiveKey="schema"
          items={[
            {
              key: 'schema',
              label: 'Schema Definition',
              children: (
                <Table 
                  dataSource={fields} 
                  columns={schemaColumns} 
                  rowKey="id" 
                  pagination={false} 
                  size="small" 
                  bordered
                />
              )
            },
            {
              key: 'data',
              label: `Data Preview (${records.length} rows)`,
              children: (
                <div style={{ overflowX: 'auto' }}>
                  <Table 
                    dataSource={records} 
                    columns={previewColumns} 
                    rowKey="recordId" 
                    pagination={false} 
                    size="small" 
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              )
            }
          ]}
        />
      )
    };
  });

  return (
    <div>
      {tablesData.size === 0 ? (
        <Empty description="No tables found in this Base" />
      ) : (
        <Collapse items={items} defaultActiveKey={items.length > 0 ? [items[0].key as string] : []} />
      )}
    </div>
  );
};

export default SchemaViewer;

