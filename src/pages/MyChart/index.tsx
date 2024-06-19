import UpdateModal from '@/pages/MyChart/components/UpdateModal';
import {
  deleteChartUsingPost,
  genChartByAiRetryUsingGet,
  listChartByPageUsingPost,
  updateChartUsingPost,
} from '@/services/imagebi-backend/chartController';
import { TinyColor } from '@ctrl/tinycolor';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, ConfigProvider, List, Result, Space, message } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

/**
 * 我的图表页面
 * @constructor
 */
const MyChart: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const { initialState } = useModel('@@initialState');
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [updateChart, setUpdateChart] = useState<API.Chart>({});

  const loginUser = initialState?.loginUser;

  const colors1 = ['#6253E1', '#04BEFE'];
  const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516'];
  const colors3 = ['#40e495', '#30dd8a', '#2bb673'];
  const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  const handleUpdate = async (fields: API.Chart) => {
    const hide = message.loading('修改中');
    try {
      await updateChartUsingPost({ ...fields });
      hide();
      message.success('更新成功');
      // 找到对应的项并更新
      setChartList((prevList) => {
        return prevList?.map((item) => {
          if (item.id === fields.id) {
            return { ...item, ...fields };
          }
          return item;
        });
      });
      return true;
    } catch (error: any) {
      hide();
      message.error('更新失败，' + error.message);
      return false;
    }
  };

  // 定义一个获取数据的异步函数
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.execStatus === 2) {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取数据失败');
      }
    } catch (e: any) {
      message.error('获取数据失败' + e.message);
    }
    setLoading(false);
  };

  const handelDelete = async (id: number | undefined) => {
    const hide = message.loading('删除中');
    try {
      await deleteChartUsingPost({ id: id });
      hide();
      message.success('删除成功');
      // 从 chartList 中移除对应的项
      loadData();
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
    }
  };

  const handleRetry = async (id: number | undefined) => {
    const hide = message.loading('重试中');
    try {
      await genChartByAiRetryUsingGet({
        chartId: id,
      });
      hide();
      message.success('重试成功，稍后查看数据');
    } catch (error: any) {
      hide();
      message.error('重试失败，' + error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart">
      <div style={{ padding: '0 24px' }}>
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value) => {
            setSearchParams({ ...initSearchParams, relatedName: value });
          }}
        />
      </div>
      <div className="margin-16" />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({ ...searchParams, current: page, pageSize });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        footer={
          <div style={{ padding: '0 24px' }}>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={loginUser && loginUser.userAvatar} />}
                title={item.relatedName}
                description={item.chartType ? '图表类型: ' + item.chartType : undefined}
              />
              <>
                {item.execStatus === 0 && (
                  <>
                    <Result
                      status="warning"
                      title="排队中"
                      subTitle={item.execMessage ?? '图表生成繁忙，请耐心等候...'}
                    />
                  </>
                )}
                {item.execStatus === 1 && (
                  <>
                    <Result status="info" title="生成中" subTitle={item.execMessage} />
                  </>
                )}
                {item.execStatus === 2 && (
                  <>
                    <div className="margin-16" />
                    <p>{'分析目标: ' + item.goal}</p>
                    <div className="margin-16" />
                    <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                  </>
                )}
                {item.execStatus === 3 && (
                  <>
                    <Result status="error" title="生成失败" subTitle={item.execMessage} />
                  </>
                )}
              </>
              <Space>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                        colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(
                          ', ',
                        )})`,
                        colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(
                          colors1,
                        ).join(', ')})`,
                        lineWidth: 0,
                      },
                    },
                  }}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setUpdateChart(item);
                      handleUpdateModalOpen(true);
                    }}
                  >
                    编辑图标代码
                  </Button>
                </ConfigProvider>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorPrimary: `linear-gradient(90deg,  ${colors2.join(', ')})`,
                        colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(colors2).join(
                          ', ',
                        )})`,
                        colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(colors2).join(
                          ', ',
                        )})`,
                        lineWidth: 0,
                      },
                    },
                  }}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      handelDelete(item.id);
                    }}
                  >
                    删除
                  </Button>
                </ConfigProvider>
                <>
                  {item.execStatus === 3 && (
                    <ConfigProvider
                      theme={{
                        components: {
                          Button: {
                            colorPrimary: `linear-gradient(116deg,  ${colors3.join(', ')})`,
                            colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                              colors3,
                            ).join(', ')})`,
                            colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                              colors3,
                            ).join(', ')})`,
                            lineWidth: 0,
                          },
                        },
                      }}
                    >
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          handleRetry(item.id);
                          setChartList((prevList) => {
                            return prevList?.map((temp) => {
                              if (temp.id === item.id) {
                                return { ...item, execStatus: 0 };
                              }
                              return temp;
                            });
                          });
                        }}
                      >
                        重试
                      </Button>
                    </ConfigProvider>
                  )}
                </>
              </Space>
            </Card>
          </List.Item>
        )}
      />
      <UpdateModal
        values={updateChart}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
        }}
        visible={updateModalOpen}
      />
    </div>
  );
};

export default MyChart;
