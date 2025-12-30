import React from 'react';
import { ConfigProvider } from 'antd';
import SchemaViewer from './components/SchemaViewer';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3370ff',
          borderRadius: 4,
        },
      }}
    >
      <div style={{ height: '100%', background: '#fff', padding: '0' }}>
        <SchemaViewer />
      </div>
    </ConfigProvider>
  );
};

export default App;
