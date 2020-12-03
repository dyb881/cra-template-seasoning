import { makeAutoObservable } from 'mobx';

/**
 * 用户
 */
export default class User {
  /**
   * 表格数据临时储存
   */
  tableDatas: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  setTableData = (key: string, value?: any) => {
    if (value) {
      this.tableDatas[key] = value;
    } else {
      delete this.tableDatas[key];
    }
  };

  getTableData = (key: string) => {
    return this.tableDatas[key];
  };
}
