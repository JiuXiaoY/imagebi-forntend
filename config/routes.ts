export default [
  { path: '/', name: '数据分析（同步）', icon: 'table', component: './AddChart' },
  {
    path: '/add_chart_async',
    name: '数据分析（异步）',
    icon: 'table',
    component: './AddChartAsync',
  },
  { path: '/my_chart', name: '我的图表', icon: 'table', component: './MyChart' },
  { path: '/message', icon: 'table', component: './Message', hideInMenu: true },
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
