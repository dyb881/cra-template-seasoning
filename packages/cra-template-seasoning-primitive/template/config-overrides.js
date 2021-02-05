const { override, addWebpackPlugin, fixBabelImports, addBabelPlugin, addLessLoader } = require('customize-cra');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const modifyVars = {
  '@s-p': '#1890ff', // 全局主色
  '@s-s': '#52c41a', // 成功色
  '@s-w': '#faad14', // 警告色
  '@s-e': '#f5222d', // 错误色
  '@s-fs': '16px', // 主字号
  '@s-c': 'rgba(0, 0, 0, 0.85)', // 主文本色
  '@s-cs': 'rgba(0, 0, 0, .45)', // 次文本色
  '@s-dc': 'rgba(0, 0, 0, .25)', // 失效色
  '@s-dcb': 'rgba(0, 0, 0, .05)', // 失效背景色
  '@s-bc': '#eee', // 边框色
  '@s-bcd': '#ccc', // 边框色-深色
  '@s-b': '#fff', // 背景色
};

module.exports = override(
  // 添加 less-loader
  addLessLoader({ lessOptions: { javascriptEnabled: true, modifyVars } }),

  fixBabelImports('lodash', { libraryDirectory: '', camel2DashComponentName: false }),
  fixBabelImports('seasoning', { libraryDirectory: 'es' }),

  // 提供编译缓存
  addWebpackPlugin(new HardSourceWebpackPlugin()),

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
