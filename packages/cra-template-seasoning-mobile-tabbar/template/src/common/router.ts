import { RouterPages } from 'seasoning';
import { TRouter as TRouterSource } from 'seasoning/es/router-pages';
import { TTab, tabbar } from './tabbar';

/**
 * 写入标题
 */
export const setTitle = (title = 'Seasoning-App') => {
  // 修改当前页面标题
  window.document.title = title;
  // 在支付宝 webview 内部调用标题写入
  window.AlipayJSBridge?.call('setTitle', { title });
};

type TRouter = TRouterSource & {
  pagePath?: string; // 页面路径，基于 src/pages 目录
  title?: string; // 页面标题
};

/**
 * tabbar 配置
 */
const tabs: TTab[] = [
  { pagePath: '/home', title: '首页' },
  { pagePath: '/user', title: '用户页' },
];

/**
 * 路由配置
 */
const routers: TRouter[] = [
  {
    path: '/',
    component: tabbar({
      tabs,
      listen: ({ title }) => {
        setTitle(title);
      },
    }),
  },
  { path: '/user', title: '用户页' },
];

/**
 * 路由页面组件
 */
export const { history, Pages, Router } = new RouterPages({
  routers: routers.map((i) => {
    let { path, pagePath = path, component } = i;
    if (!component) component = require('../pages' + pagePath).default as React.ComponentType<any>;
    return { ...i, component };
  }),
  // 监听路由变动
  listen: ({ title }) => {
    setTitle(title);
  },
});
