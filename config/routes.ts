/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    hideInMenu: true,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
        hideInMenu: true,
        layout: false,
      },
    ],
  },
  {
    path: '/querying',
    name: '监控中心',
    routes: [
      { path: '/querying', redirect: '/querying/realtime-status' },
      {
        path: '/querying/realtime-status',
        name: '实时状态',
        icon: 'dashboard',
        component: './Monitor/realtime-status',
      },
      {
        path: '/querying/history-status',
        name: '按日统计运行数据',
        icon: 'history',
        component: './Monitor/history-status',
      },
      {
        path: '/querying/running',
        name: '每日分时运行数据',
        icon: 'sync',
        component: './Monitor/running',
      },
      {
        path: '/querying/power',
        name: '按日统计节能数据',
        icon: 'fund',
        component: './Monitor/power',
      },
    ],
  },
  {
    path: '/station/list',
    name: '局站管理',
    component: './StationManage/station-list',
  },
  {
    path: '/warning/list',
    name: '告警管理',
    // hideInMenu: true,
    component: './WarningManage/warning-list',
  },
  {
    path: '/userMange/list',
    name: '用户管理',
    // hideInMenu: true,
    component: './User/UserList',
  },
  {
    path: '/remote',
    name: '远程设置',
    // hideInMenu: true,
    routes: [
      {
        path: '/remote/querying',
        name: '远程查询',
        icon: 'dashboard',
        component: './Remote/querying',
      },
      {
        path: '/remote/warning-handle',
        name: '告警控制',
        icon: 'history',
        component: './Remote/warning-handle',
      },
      {
        path: '/remote/electric-meter',
        name: '电表参数',
        icon: 'sync',
        component: './Remote/electric-meter',
      },
      {
        path: '/remote/warning-setting',
        name: '告警参数',
        icon: 'fund',
        component: './Remote/warning-setting',
      },
      {
        path: '/remote/cleaning',
        name: '自清洁参数',
        icon: 'dashboard',
        component: './Remote/cleaning',
      },
      {
        path: '/remote/alternative',
        name: '轮替模式参数',
        icon: 'history',
        component: './Remote/alternative',
      },
      {
        path: '/remote/fresh-air',
        name: '新风模式参数',
        icon: 'sync',
        component: './Remote/fresh-air',
      },
      {
        path: '/remote/auto-mode',
        name: '自动模式参数',
        icon: 'fund',
        component: './Remote/auto-mode',
      },
      {
        path: '/remote/running-mode',
        name: '运行模式',
        icon: 'history',
        component: './Remote/running-mode',
      },
      {
        path: '/remote/debug-relay',
        name: '新风设备',
        icon: 'dashboard',
        component: './Remote/debug-relay',
      },
      {
        path: '/remote/air-parameter',
        name: '空调模式',
        icon: 'sync',
        component: './Remote/air-parameter',
      },
    ],
  },
  {
    path: '/',
    redirect: '/querying/realtime-status',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
