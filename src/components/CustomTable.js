import React from 'react';
import { Table, ConfigProvider } from 'antd';

const CustomTable = ({ columns, dataSource }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: '#F9F9F9',
            colorText: '#0000000',
            colorTextHeading: '#FFFFF',
          },
        },
      }}
    >
      <div>
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </ConfigProvider>
  );
};

export default CustomTable;
