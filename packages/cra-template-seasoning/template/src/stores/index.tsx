import User from './user';
import { mobxCombine } from 'seasoning';

class Stores {
  user = new User();
}

/**
 * 全局状态
 */
export const stores = new Stores();

/**
 * 生成关联器
 */
export const { combine, combinePage } = mobxCombine(stores);
