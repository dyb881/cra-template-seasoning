import { useEffect, useCallback } from 'react';
import { useStates } from 'seasoning/es/hooks';
import { stores } from 'stores';

/**
 * 表单状态
 */
export type TUseDetailsStates = {
  data: any; // 表单默认信息
  loading: boolean | string; // 加载中
};

export type TUseDetailsOptions = {
  defaultData?: TUseDetailsStates['data'];
  getData?: () => void; // 获取数据
};

/**
 * 表单信息页 Hooks
 * 自定义 Hooks，内置表格页常用数据
 */
export const useDetails = (options?: TUseDetailsOptions) => {
  const { defaultData = {}, getData } = options || {};
  const { states, setStates } = useStates<TUseDetailsStates>({ data: defaultData, loading: false });
  const { data, loading } = states;

  useEffect(() => {
    stores.user.onLogin(() => {
      getData?.(); // 获取默认值
    });
  }, []);

  /**
   * 写入表单数据
   */
  const setData = useCallback((data: TUseDetailsStates['data']) => setStates({ data }), []);

  /**
   * 设置加载状态
   */
  const setLoading = useCallback((loading: TUseDetailsStates['loading']) => setStates({ loading }), []);

  const pageDetailsProps = { loading };

  return { states, setStates, data, setData, setLoading, pageDetailsProps, getData };
};
