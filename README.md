# Create React App Seasoning Templates

基于[seasoning](https://github.com/dyb881/seasoning)开发的业务模版

## 学习使用

- [react 的基础知识和常用包](https://github.com/dyb881/recommended)
- [环境配置](https://www.yuque.com/xiangbudaowojingran/web/vx6qpl)
- [使用教程](https://www.yuque.com/xiangbudaowojingran/web/dqq25f)

## 使用方法

```sh
npx create-react-app my-app --template seasoning // 默认模版
npx create-react-app my-app --template seasoning-mobile // 移动端模版
npx create-react-app my-app --template seasoning-mobile-tabbar // 移动端模版，带上 tabbar
npx create-react-app my-app --template seasoning-pc // PC端模版
npx create-react-app my-app --template seasoning-pc-admin // PC端模版，管理后台模版，账号密码都是 admin
```

```
yarn start // 运行开发环境
yarn build // 打包代码
yarn start:https // 运行 https 的开发环境
yarn build:production // 打包不产生映射文件的代码
yarn analyze // 分析包的大小
yarn serve // 运行静态文件服务器，并指向 build 文件夹
```

## src 目录结构

开发项目过程中，一般只会在 src 文件夹下进行开发（未说明的文件一般情况下无需理会）

- apis - 所有接口统一在此封装
- common - 公用功能
  - request - 请求器初始化生成
  - router - 路由生成
- components - 业务组件封装（指会被多次使用或独立于页面外的组件，页面独有组件建议在页面文件夹内开发）
- images - 项目存放图片的地方
- pages - 页面（一般情况下项目以页面为单位创建文件夹，然后在 configs/routers 中配置即可）
- stores - 状态初始化，状态关联函数和状态关联装饰器生成（主状态下有多个子状态，主状态的构造函数执行状态初始化）
- utils - 自定义工具和第三方 sdk 集合
- App.css - 样式初始化
- App.less - 默认样式类
- App.tsx - 页面入口，除了布局组件的插入，一般不会变动
- react-app-env.d.ts - 全局类型声明
