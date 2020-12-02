const { override, addWebpackPlugin, fixBabelImports, addBabelPlugin, addLessLoader } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

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

module.exports = override(
  // 添加 less-loader
  addLessLoader({ lessOptions: { javascriptEnabled: true, modifyVars } }),

  // 配置常用的按需加载
  fixBabelImports('antd', { libraryDirectory: 'es', style: true }),
  fixBabelImports('antd-mobile', { libraryDirectory: 'es', style: true }),
  fixBabelImports('lodash', { libraryDirectory: '', camel2DashComponentName: false }),
  fixBabelImports('seasoning', { libraryDirectory: 'es' }),

  // Day.js 替换 momentjs 来大幅减小打包大小
  addWebpackPlugin(new AntdDayjsWebpackPlugin()),

  // 自定义配置
  (config) => {
    // 全局删除 console
    if (process.env.GENERATE_SOURCEMAP === 'false') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }

    // 打印运行配置
    // const fs = require('fs');
    // fs.writeFileSync(`config-${process.env.NODE_ENV}.json`, JSON.stringify(config, null, 2));

    return config;
  }
);
