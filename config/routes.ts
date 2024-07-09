export default [
  {
    path: '/',
    name: '主页',
    icon: 'CrownTwoTone',
    component: './Index',
  },
  {
    path: '/functionPoint',
    name: '相关功能',
    icon: 'FireTwoTone',
    routes: [
      { path: '/functionPoint/add_chart', name: '数据分析（同步）', component: './AddChart' },
      {
        path: '/functionPoint/add_chart_async',
        name: '数据分析（异步）',
        component: './AddChartAsync',
      },
      {
        path: '/functionPoint/api/interfaceMsg',
        name: '接口调用',
        component: './API/InterfaceMsg',
      },
    ],
  },
  {
    path: '/ownMessage',
    name: '查看分析',
    icon: 'PieChartTwoTone',
    routes: [
      { path: '/ownMessage/my_chart', name: '图表分析', component: './MyChart' },
      {
        path: '/ownMessage/api/interfaceAnalysis',
        name: '接口分析',
        component: './API/InterfaceAnalysis',
      },
    ],
  },
  {
    path: '/previous',
    name: '历史记录',
    icon: 'ContactsTwoTone',
    routes: [
      {
        path: '/previous/api/purchaseRecord',
        name: '购买记录',
        component: './API/PurchaseRecord',
      },
      {
        path: '/previous/api/orderInfo',
        name: '订单信息',
        component: './API/OrderInfo',
        access: 'canAdmin',
      },
    ],
  },
  {
    path: '/review',
    name: '审查管理',
    icon: 'ToolTwoTone',
    routes: [
      { path: '/review/api/interfaceInfo', name: '接口管理', component: './API/InterfaceInfo' },
    ],
  },
  {
    path: '/interface_info/:id',
    name: '详细信息',
    icon: 'table',
    component: './API/InterfaceMsg/Detail',
    hideInMenu: true,
  },
  { path: '/message', name: '我的消息', icon: 'table', component: './Message', hideInMenu: true },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
