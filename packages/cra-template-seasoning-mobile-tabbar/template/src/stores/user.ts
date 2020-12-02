import { makeAutoObservable, when } from 'mobx';

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
}
