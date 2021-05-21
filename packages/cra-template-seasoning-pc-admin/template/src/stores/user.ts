import { makeAutoObservable, when, runInAction } from 'mobx';
import { message } from 'antd';
import { menuData } from 'common/menu';
import { modalConfirm } from 'common/antd';
import { history } from 'common/router';
import { auth } from 'apis';
import { cloneDeep, get } from 'lodash';

/**
 * 用户
 */
export default class User {
  /**
   * 是否登录
   */
  isLogin = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 登陆状态监听
   */
  onLogin = (bind: boolean | (() => void)) => {
    if (typeof bind === 'boolean') {
      this.isLogin = bind;
    } else {
      return when(() => this.isLogin, bind);
    }
  };

  access_token = localStorage.access_token;
  info: any = {};
  menu: any[] = [];
  get Authorization() {
    return `Bearer ${this.access_token}`;
  }

  /**
   * 显示登录页面
   */
  get showLogin() {
    return !this.isLogin && !this.access_token;
  }

  /**
   * 权限过滤菜单
   */
  permissionFilter(info: any) {
    const { pathname } = history.location;
    let isAvailable = false;
    const permissionFilter = (data: any[]) => {
      return data.filter((i) => {
        if (i.children) i.children = permissionFilter(i.children);

        // 子菜单为空
        if (i.children && !i.children.length) return false;

        // 如果有权限配置，则判断权限是否可用
        if (i.permission) {
          if (!get(info.role.permissions, i.permission)) return false;
        }

        // 存在当前路由
        if (pathname === i.path) isAvailable = true;

        return true;
      });
    };
    const menu = permissionFilter(cloneDeep(menuData));
    // 当前路由不可用，跳转到可用路由的第一个
    isAvailable || history.push(menu[0].children[0].path);
    this.menu = menu;
  }

  /**
   * 登录
   */
  login = async (values: any) => {
    const res = await auth.login(values);
    if (res.ok) {
      const { access_token, ...info } = res.data;
      message.success('登录成功');
      Object.assign(localStorage, { access_token });
      this.permissionFilter(info);
      Object.assign(this, { access_token, info, isLogin: true });
    }
  };

  /**
   * 退出登录
   */
  logout = () => {
    Object.assign(this, { access_token: '', info: {}, isLogin: false });
    localStorage.removeItem('access_token');
  };

  /**
   * 注销对话框
   */
  logoutConfirm = () => {
    modalConfirm({
      title: '确定要退出登录吗？',
      okButtonProps: { danger: true },
      onOk: this.logout,
    });
  };

  /**
   * 自动登录
   */
  autoLogin = async () => {
    if (!this.access_token) return;
    message.loading('自动登录', 0);
    const res = await this.getInfo();
    message.destroy();
    if (!res.ok) {
      message.error('登录超时');
      this.logout();
    }
  };

  /**
   * 获取用户信息
   */
  getInfo = async () => {
    const res = await auth.getInfo(`Bearer ${this.access_token}`);
    if (res.ok) {
      this.permissionFilter(res.data);
      runInAction(() => {
        this.info = res.data;
        this.isLogin = true;
      });
    }
    return res;
  };
}
