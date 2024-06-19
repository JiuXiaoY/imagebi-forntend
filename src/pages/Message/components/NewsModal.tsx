import '@umijs/max';
import { Modal } from 'antd';
import React from 'react';
import {formatDateTime} from "@/global";

export type Props = {
  onCancel: () => void;
  visible: boolean;
  item: API.ChartMessageQueryResponse | null
};

const NewsModal: React.FC<Props> = (props) => {
  const {  visible, onCancel, item } = props;
  return (
    <Modal open={visible} footer={null} title={item?.relatedName} onCancel={() => onCancel?.()}>
      <p>{item?.messageContent}</p>
      <p>{formatDateTime(item?.messageTime)}</p>
    </Modal>
  );
};
export default NewsModal;
