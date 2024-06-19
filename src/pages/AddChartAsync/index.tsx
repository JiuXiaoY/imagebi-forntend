import {
  genChartByAiAsyncMqUsingPost,
  genChartByAiAsyncUsingPost,
} from '@/services/imagebi-backend/chartController';
import { unreadCountUsingPost } from '@/services/imagebi-backend/chartMessageController';
import { createWebSocket, websocketClose } from '@/websocket';
import { useModel } from '@@/exports';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select, Space, Upload, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';

/**
 * 添加图表页面(异步)
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const timer = initialState?.timer;

  useEffect(() => {
    websocketClose();
    createWebSocket(`ws://localhost:7101/bi/websocket/${loginUser?.id}`);

    const getUnreadCount = async () => {
      try {
        const res = await unreadCountUsingPost({
          receiverId: loginUser?.id,
        });
        setInitialState((prevState) => ({
          ...prevState,
          UN_READ_COUNT: res.data ? res.data : 0,
        }));
      } catch (e: any) {
        message.error('获取未读消息数量失败，' + e.message);
      }
    };
    if (!timer) {
      // 定时器
      const interval = setInterval(() => {
        getUnreadCount();
      }, 5000);

      setInitialState((prevState) => ({
        ...prevState,
        timer: true,
      }));

      // 在页面关闭时清除定时器
      window.addEventListener('beforeunload', () => {
        clearInterval(interval);
      });
    }
    // 如果定时器已设置，返回一个空函数避免重复执行
    return () => {};
  }, []);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const analysisMethod = values.analysisMethod;
      let res;
      if (analysisMethod === 'threadPool') {
        res = await genChartByAiAsyncUsingPost(params, {}, values.file.file.originFileObj);
      } else if (analysisMethod === 'MQ') {
        res = await genChartByAiAsyncMqUsingPost(params, {}, values.file.file.originFileObj);
      }
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        // 重置所有表单项
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Card title="智能分析">
        <Form
          form={form}
          name="addChart"
          labelAlign="right"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '请输入分析目标' }]}
          >
            <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
          </Form.Item>
          <Form.Item name="relatedName" label="图表名称">
            <Input placeholder="请输入图表名称" />
          </Form.Item>
          <Form.Item name="chartType" label="图表类型">
            <Select
              options={[
                { value: '折线图', label: '折线图' },
                { value: '柱状图', label: '柱状图' },
                { value: '堆叠图', label: '堆叠图' },
                { value: '饼图', label: '饼图' },
                { value: '雷达图', label: '雷达图' },
              ]}
            />
          </Form.Item>

          <Form.Item label="原始数据">
            <Row align="top">
              <Col>
                <Form.Item name="file" noStyle>
                  <Upload name="file" maxCount={1}>
                    <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: 32 }}>
                <Form.Item
                  label="分析方式(异步)"
                  name="analysisMethod"
                  style={{ marginBottom: '0' }}
                >
                  <Select
                    style={{ width: 120 }}
                    options={[
                      { value: 'threadPool', label: '线程池' },
                      { value: 'MQ', label: '消息队列' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 3 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
