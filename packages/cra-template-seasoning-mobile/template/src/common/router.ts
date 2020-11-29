import { RouterPages } from 'seasoning';

type TRouter = {
  path: string; // 注册路由
  pagePath?: string; // 页面路径，基于 src/pages 目录
  component?: React.ComponentType<any>; // 页面组件
  title?: string; // 页面标题
  [key: string]: any;
};

/**
 * 路由配置
 */
const routers: TRouter[] = [
  { path: '/', pagePath: '/home' },
  { path: '/user', title: '用户页' },
];

/**
 * 路由页面组件
 */
export const { history, Pages, Router } = new RouterPages({
  routers: routers.map((i) => {
    let { path, pagePath = path, component } = i;
    if (!component) {
      component = require('../pages' + pagePath).default as React.ComponentType<any>;
    }
    return { ...i, component };
  }),
  // 监听路由变动
  listen: ({ title = 'Seasoning-App' }) => {
    // 修改当前页面标题
    window.document.title = title;
    // 在支付宝 webview 内部调用标题写入
    window.AlipayJSBridge?.call('setTitle', { title });
  },
});
