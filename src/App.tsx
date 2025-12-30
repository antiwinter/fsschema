import React from 'react';
import { ConfigProvider, Layout, Typography, theme } from 'antd';
import SchemaViewer from './components/SchemaViewer';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3370ff', // Lark blue
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>Base Schema Viewer</Title>
        </Header>
        <Content style={{ padding: '24px' }}>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <SchemaViewer />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#999' }}>
          Sidext Schema Viewer ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
