import { mobxCombine } from 'seasoning';
import User from './user';
import View from './view';
import Layout from './layout';

class Stores {
  user = new User();
  view = new View();
  layout = new Layout();
}

/**
 * 全局状态
 */
export const stores = new Stores();

/**
 * 生成关联器
 */
export const { combine, combinePage } = mobxCombine(stores);
