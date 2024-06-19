import { ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib';
import { Modal } from 'antd';
import React from 'react';

export type Props = {
  values: API.Chart;
  onCancel: () => void;
  onSubmit: (values: API.Chart) => Promise<void>;
  visible: boolean;
};

const UpdateModal: React.FC<Props> = (props) => {
  const { values, visible, onCancel, onSubmit } = props;

  const columns: ProColumns<API.Chart>[] = [
    {
      title: '图表id:',
      dataIndex: 'id',
      valueType: 'text',
      readonly: true,
      initialValue: values?.id, // Setting initial value
    },
    {
      title: '图表option v5代码:',
      dataIndex: 'genChart',
      valueType: 'jsonCode',
      initialValue: values?.genChart, // Setting initial value
      fieldProps: {
        style: { height: '500px' }, // Adjust height here
      },
    },
  ];

  return (
    <Modal
      key={values?.id}
      open={visible} // "open" changed to "visible"
      footer={null}
      onCancel={() => onCancel?.()}
      width={800}
    >
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      />
    </Modal>
  );
};

export default UpdateModal;
