import { makeAutoObservable } from 'mobx';

/**
 * 视图
 */
export default class View {
  activeKey = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveKey = (activeKey: number) => {
    this.activeKey = activeKey;
  };
}
