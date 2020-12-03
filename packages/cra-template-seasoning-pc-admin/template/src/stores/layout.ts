import { makeAutoObservable } from 'mobx';
import { debounce } from 'lodash';
import { fileToBase64 } from 'seasoning/es/file-tool';

type TSetting = any;

/**
 * 用户
 */
export default class User {
  constructor() {
    makeAutoObservable(this);
    this.resize();
    window.addEventListener('resize', debounce(this.resize, 100));
  }

  /**
   * 自动计算左边导航
   */
  resize = () => {
    const { innerWidth: w, innerHeight: h } = window;
    this.isMobile = w <= 750;
    this.collapsed = !this.isMobile && !this.setting.hiddenMenu && w <= 1000;
    this.width = w;
    this.height = h;
  };

  width = window.innerWidth; // 屏幕宽度
  height = window.innerHeight; // 屏幕高度
  isMobile = false; // 是否移动端
  collapsed = false;
  collapsedChange = () => {
    this.collapsed = !this.collapsed;
  };
  showHeader = false;
  showHeaderChange = () => {
    this.showHeader = !this.showHeader;
  };

  /**
   * 页面配置数据
   */
  setting: TSetting = ((jsonString) => {
    const setting = jsonString ? JSON.parse(jsonString) : {};
    return {
      componentSize: undefined,
      theme: 'dark',
      hiddenMenu: false,
      hiddenHeader: false,
      menuIconTop: 50,
      headerIconRight: 30,
      ...setting,
    };
  })(localStorage['ra-admin-setting']);

  setSetting = (pageConfig: Partial<TSetting>) => {
    const setting = { ...this.setting, ...pageConfig };
    localStorage['ra-admin-setting'] = JSON.stringify(setting);
    this.setting = setting;
  };

  previewSrc = '';
  previewType = '';
  previewName = '';

  /**
   * 预览
   */
  preview = async (file: File | string, type = 'image', name = '') => {
    const src = file instanceof File ? await fileToBase64(file) : file;
    this.previewSrc = src;
    this.previewType = type;
    this.previewName = name;
  };

  previewHide = () => {
    this.previewSrc = '';
  };
}
