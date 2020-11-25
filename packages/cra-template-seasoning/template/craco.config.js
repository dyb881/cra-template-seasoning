const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              '@ra-p': '#1890ff', // 全局主色
              '@ra-s': '#52c41a', // 成功色
              '@ra-w': '#faad14', // 警告色
              '@ra-e': '#f5222d', // 错误色
              '@ra-fs': '16px', // 主字号
              '@ra-c': 'rgba(0, 0, 0, 0.85)', // 主文本色
              '@ra-cs': 'rgba(0, 0, 0, .45)', // 次文本色
              '@ra-dc': 'rgba(0, 0, 0, .25)', // 失效色
              '@ra-dcb': 'rgba(0, 0, 0, .05)', // 失效背景色
              '@ra-bc': '#eee', // 边框色
              '@ra-bcd': '#ccc', // 边框色-深色
              '@ra-b': '#fff', // 背景色
            },
          },
        },
      },
    },
  ],
};
