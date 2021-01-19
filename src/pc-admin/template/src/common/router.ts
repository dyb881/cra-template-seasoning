import { RouterPages } from 'seasoning';
import { TRouter as TRouterSource } from 'seasoning/es/router-pages';
import { menuData } from './menu';
import { getMenuNavDataRouters } from './antd';

/**
 * 默认标题
 */
export const defaultTitle = 'Nest-Admin';

/**
 * 写入标题
 */
export const setTitle = (title = defaultTitle) => {
  // 修改当前页面标题
  window.document.title = title;
  // 在支付宝 webview 内部调用标题写入
  window.AlipayJSBridge?.call('setTitle', { title });
};

export type TRouter = TRouterSource & {
  pagePath?: string; // 页面路径，基于 src/pages 目录
  title?: string; // 页面标题
};

/**
 * 路由配置
 */
const routers: TRouter[] = [...getMenuNavDataRouters(menuData)];

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
    setTitle(`${title} - ${defaultTitle}`);
  },
});
