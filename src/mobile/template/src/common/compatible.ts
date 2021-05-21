/**
 * 在入口文件顶部引用运行兼容代码
 */

/**
 * 兼容包
 * 根据需要兼容的机型，按需载入兼容包
 * 默认不安装依赖，自行安装
 * whatwg-fetch es6-proxy-polyfill@1.2.1 core-js abort-controller
 */
// import 'whatwg-fetch';
// import 'core-js/features/object/entries';
// import 'core-js/features/object/values';
// import 'core-js/features/object/assign';
// import 'core-js/features/string/includes';
// import 'core-js/features/array/includes';
// import 'core-js/features/array/from';
// import 'core-js/features/promise';
// import 'core-js/features/symbol';
// import 'core-js/features/set';
// import 'core-js/features/map';
// import 'abort-controller/polyfill';
import { autoRem, isIOS, isAndroid, activeElementScrollIntoView } from 'seasoning/es/compatible';

autoRem(320, 750, true);

/**
 * 处理 iOS 兼容
 */
if (isIOS) {
  window.addEventListener('focusout', () => {
    // 修复微信浏览器版本6.7.4 IOS12会出现键盘收起后，视图被顶上去了没有下来
    setTimeout(() => window.scrollTo(0, document.body.scrollTop));
  });
}

/**
 * 处理 Android 兼容
 */
if (isAndroid) {
  // Android 键盘弹出、收起，可视区高度会发生变化时，滚动到输入框
  window.addEventListener('resize', activeElementScrollIntoView, false);
}

/**
 * 错误拦截处理，防止白屏
 */
window.onerror = (...err: any[]) => {
  console.log(...err);
};
