import ListDisplay from '@/pages/Message/components/ListDisplay';
import NewsModal from '@/pages/Message/components/NewsModal';
import {
  deleteChartMessageUsingPost,
  getAllChartMsgUsingGet,
  tickleToReadUsingGet,
} from '@/services/imagebi-backend/chartMessageController';
import { useModel } from '@@/exports';
import { CommentOutlined, MessageOutlined, SoundTwoTone } from '@ant-design/icons';
import { Card, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 我的消息页面
 * @constructor
 */

const MyMessage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { initialState } = useModel('@@initialState');
  const [list, setList] = useState<API.ChartMessageQueryResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<API.ChartMessageQueryResponse | null>(null);

  const loginUser = initialState?.loginUser;

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllChartMsgUsingGet({
        receiverId: loginUser?.id,
      });
      if (res.data) {
        setList(res.data);
      }
    } catch (e: any) {
      message.error('加载失败' + e.message);
    }
    setLoading(false);
  };

  const tickleToRead = async (item: API.ChartMessageQueryResponse) => {
    try {
      await tickleToReadUsingGet({
        id: item.id,
      });
    } catch (e: any) {
      message.error('标记已读失败' + e.message);
    }
  };

  const deleteMsg = async (id: number | undefined) => {
    try {
      const res = await deleteChartMessageUsingPost({ id });
      if (res.data) {
        message.success('删除成功');
        loadData(); // Re-fetch the data to update the list
      }
    } catch (e: any) {
      message.error('删除失败' + e.message);
    }
  };

  const showModal = (item: API.ChartMessageQueryResponse) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    if (item.messageStatus === 0) {
      tickleToRead(item);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const myItems = [
    {
      key: '0',
      label: '系统消息',
      children: (
        <ListDisplay
          list={list}
          loading={loading}
          showModal={showModal}
          tagKey={0}
          onDelete={deleteMsg}
        />
      ),
      icon: <CommentOutlined />,
    },
    {
      key: '1',
      label: '我的消息',
      children: (
        <ListDisplay
          list={list}
          loading={loading}
          showModal={showModal}
          tagKey={1}
          onDelete={deleteMsg}
        />
      ),
      icon: <SoundTwoTone />,
    },
    {
      key: '2',
      label: '私信',
      children: (
        <ListDisplay
          list={list}
          loading={loading}
          showModal={showModal}
          tagKey={2}
          onDelete={deleteMsg}
        />
      ),
      icon: <MessageOutlined />,
    },
  ];
  return (
    <div className="myMessage" style={{ display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: '70%' }}>
        <Tabs defaultActiveKey="0" size="middle" items={myItems} />
      </Card>

      <NewsModal
        onCancel={() => {
          handleCancel();
        }}
        visible={isModalOpen}
        item={selectedItem}
      />
    </div>
  );
};
export default MyMessage;
