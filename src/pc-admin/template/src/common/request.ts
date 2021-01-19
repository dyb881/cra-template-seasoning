import { message } from 'antd';
import { dataTool, Request } from 'seasoning';
import { stores } from 'stores';

/**
 * 是否生产环境
 */
export const isProduction = window.location.protocol === 'https:';

// ------------------------------- 请求器配置 --------------------------------- //

/**
 * 生产地址
 */
export let host = 'http://101.200.80.178:3010';

/**
 * 测试地址
 */
const hostTest = 'http://101.200.80.178:3010';

/**
 * 会根据 isProduction 自行变动，需要配置对应的生产和测试地址
 * 测试环境下链接参数 params.host 可强制变更 host
 */
if (!isProduction) {
  const params = dataTool.getParams();
  host = params.host || hostTest;
}

/**
 * 请求器初始化并导出
 */
export const { baseURL, get, post, put, patch, del, upload } = new Request({
  host, // 请求服务地址
  apiPath: '/api', // 接口公用路径
  console: true, // 打印日志
  interceptorsRequest: (config) => {
    if (stores.user.isLogin) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${stores.user.access_token}`,
      };
    }
    return config;
  },
  interceptorsResponse: (res, config) => {
    res.ok || config.noToast || message.error(res.errorText);
    return res;
  },
});
