import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { autorun } from 'mobx';
import { message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { TForm, modalDel } from 'common/antd';
import { ButtonMobile, TPageTableProps } from 'components';
import { useStates } from 'seasoning/es/hooks';
import { stores } from 'stores';

/**
 * 表格状态
 */
export type TUseTableStates = {
  search: object; // 搜索内容
  current: number; // 当前页码
  pageSize: number; // 每页展示多少条数据
  total: number; // 数据总数
  dataSource: any[]; // 表格数据
  selectedRowKeys: React.ReactText[]; // 选中行
  loading: boolean | string; // 加载中
  [key: string]: any;
};

export type TUseTableOptions = {
  onList: (states: TUseTableStates) => Promise<void>; // 获取列表
  onDel?: (ids: string[]) => Promise<boolean>; // 删除数据
  defaultStates?: Partial<TUseTableStates>; // 默认状态
  tableDataKey?: string; // 表格数据 key
};

/**
 * 表格页 Hooks
 * 自定义 Hooks，内置表格页常用数据
 */
export const useTable = (options: TUseTableOptions) => {
  const { onList, onDel, defaultStates, tableDataKey = 'root' } = options;
  const { getTableData, setTableData } = stores.view;
  const formRef = useRef<TForm>(null);
  const { states, setStates } = useStates<TUseTableStates>({
    search: {},
    current: 1,
    pageSize: 20,
    total: 0,
    dataSource: [],
    selectedRowKeys: [],
    loading: false,
    ...defaultStates, // 写入默认值
    ...getTableData(tableDataKey), // 获取表格缓存数据
  });
  const { search, current, pageSize, total, dataSource, selectedRowKeys, loading } = states;

  useEffect(() => {
    // 写入默认值
    formRef.current?.form.setFieldsValue(search);

    return autorun(() => {
      // 根据窗口宽度调整 pageSize
      stores.layout.isMobile && setStates({ pageSize: 20 });
    });
  }, []);

  /**
   * use 监听条件，数组的任意一个值发生变动时，执行对应更新
   */
  const useList = [current, pageSize, JSON.stringify(search)];

  /**
   * 获取列表
   */
  const getList = useCallback(async () => {
    setLoading('请求列表');
    await onList(states);
    setLoading(false);
  }, [useList]);

  /**
   * 根据监听刷新数据
   */
  useEffect(() => {
    // 缓存表格数据
    setTableData(tableDataKey, { search, current, pageSize });
    // 请求数据
    stores.user.onLogin(getList);
  }, useList);

  /**
   * 设置表格数据
   */
  const setData = useCallback(
    (dataSource: TUseTableStates['dataSource'], total?: TUseTableStates['total']) =>
      setStates({ dataSource, total, selectedRowKeys: [] }),
    []
  );

  /**
   * 设置加载状态
   */
  const setLoading = useCallback((loading: TUseTableStates['loading']) => setStates({ loading }), []);

  /**
   * 表单提交
   */
  const onFinish = useCallback((search: TUseTableStates['search']) => setStates({ search, current: 1 }), []);

  /**
   * 分页变动
   */
  const paginationOnChange = useCallback((current, pageSize) => setStates({ current, pageSize }), []);

  /**
   * 表格选中
   */
  const rowSelectionOnChange = useCallback((selectedRowKeys: React.ReactText[]) => setStates({ selectedRowKeys }), []);

  /**
   * 删除数据
   */
  const del = useMemo(
    () =>
      modalDel(async (ids) => {
        const success = await onDel?.(ids);
        if (!success) return;
        message.success(`删除数据成功`);
        getList();
      }),
    []
  );

  /**
   * 批量删除按钮
   */
  const DelButton = useCallback<React.FC>(() => {
    const { length } = selectedRowKeys;
    return (
      <>
        <span>选中 {length} 条</span>
        <ButtonMobile danger icon={<DeleteOutlined />} disabled={!length} onClick={() => del(selectedRowKeys)}>
          删除
        </ButtonMobile>
      </>
    );
  }, [selectedRowKeys.length]);

  /**
   * 表格页
   */
  const pageTableProps: Partial<TPageTableProps> = {
    // 分页配置
    paginationProps: { current, pageSize, total, onChange: paginationOnChange },
    dataSource,
    loading,
    reload: getList,
    rowSelection: { selectedRowKeys, onChange: rowSelectionOnChange },
  };

  /**
   * 搜索框
   */
  const formSearchProps = { onFinish, ref: formRef };

  return { states, setStates, setData, setLoading, pageTableProps, formSearchProps, useList, getList, del, DelButton };
};
