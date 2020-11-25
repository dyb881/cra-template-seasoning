const getImport = (name, options) => ['import', { libraryName: name, ...options }, name];

const modifyVars = {
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
};

module.exports = {
  babel: {
    plugins: [
      // 常用库按需加载配置
      getImport('antd', { libraryDirectory: 'es', style: true }),
      getImport('antd-mobile', { libraryDirectory: 'es', style: true }),
      getImport('lodash', { libraryDirectory: '', camel2DashComponentName: false }),
      getImport('seasoning', { libraryDirectory: 'es', camel2DashComponentName: false, style: true }),
    ],
  },
  plugins: [
    {
      // Day.js 替换 momentjs 来大幅减小打包大小
      plugin: require('antd-dayjs-webpack-plugin'),
      // 插件
      plugins: [],
    },

    {
      // less 配置
      plugin: require('craco-less'),
      // 重写 less 变量
      options: { lessLoaderOptions: { lessOptions: { javascriptEnabled: true, modifyVars } } },
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      // 全局删除 console
      if (process.env.GENERATE_SOURCEMAP === 'false') {
        webpackConfig.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      }

      // 打印运行配置
      // const fs = require('fs');
      // fs.writeFileSync(`config-${process.env.NODE_ENV}.json`, JSON.stringify(webpackConfig, null, 2));

      return webpackConfig;
    },
  },
};
