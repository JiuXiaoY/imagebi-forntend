import { formatDateTime } from '@/global';
import { useModel } from '@umijs/max';
import { Avatar, Badge, List, Skeleton } from 'antd';
import React from 'react';

interface ListDisplayProps {
  list: API.ChartMessageQueryResponse[];
  loading: boolean;
  showModal: (item: API.ChartMessageQueryResponse) => void;
  tagKey: number | null;
  onDelete: (id: number | undefined) => void;
}

const ListDisplay: React.FC<ListDisplayProps> = ({
  list,
  loading,
  showModal,
  tagKey,
  onDelete,
}) => {
  const apiLink = '/my_chart';

  return (
    <List
      className="MyNews"
      loading={loading}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item) =>
        item.messageType === tagKey && (
          <List.Item
            actions={[
              <a
                key="concreate"
                onClick={() => {
                  showModal(item);
                  if (item.messageStatus === 0) {                    // Update item.messageStatus to 1
                    item.messageStatus = 1;
                  }
                }}
              >
                详情
              </a>,
              <a key="delete" onClick={() => onDelete(item.id)}>
                删除
              </a>,
            ]}
          >
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                avatar={
                  <Badge dot={item.messageStatus === 0}>
                    <Avatar shape="circle" src={item.avatarUrl} />
                  </Badge>
                }
                title={<a href={apiLink}>{item.relatedName}</a>}
                description={item.messageContent}
              />
              <div>{formatDateTime(item.messageTime)}</div>
            </Skeleton>
          </List.Item>
        )
      }
    />
  );
};

export default ListDisplay;
