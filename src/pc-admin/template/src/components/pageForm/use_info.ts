import { useRef, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { FormProps } from 'antd/es/form';
import { useStates } from 'seasoning/es/hooks';
import { TForm, useForm } from 'common/antd';
import { stores } from 'stores';

/**
 * 表单状态
 */
export type TUseInfoStates = {
  data: any; // 表单默认信息
  loading: boolean | string; // 加载中
};

export type TUseInfoOptions = {
  defaultData?: TUseInfoStates['data']; // 默认值
  getData?: () => void; // 获取数据
  onFinish?: FormProps['onFinish']; // 保存数据
};

/**
 * 表单信息页 Hooks
 * 自定义 Hooks，内置表格页常用数据
 */
export const useInfo = (options?: TUseInfoOptions) => {
  const { defaultData = {}, getData, onFinish } = options || {};
  const formRef = useRef<TForm>(null);
  const { states, setStates } = useStates<TUseInfoStates>({ data: defaultData, loading: false });
  const { data, loading } = states;

  useEffect(() => {
    stores.user.onLogin(() => {
      getData?.(); // 获取默认值
    });
  }, []);

  /**
   * 写入表单数据
   */
  const setData = useCallback((data: TUseInfoStates['data']) => {
    setStates({ data });
    formRef.current?.reset(); // 写入数据后重置表单
  }, []);

  /**
   * 设置加载状态
   */
  const setLoading = useCallback((loading: TUseInfoStates['loading']) => setStates({ loading }), []);

  const pageFormProps = { loading, ref: formRef, initialValues: data, scrollToFirstError: true, onFinish };

  return { data, setData, setLoading, pageFormProps, formRef };
};

/**
 * 弹窗表单状态
 */
export type TUseInfoModalStates = {
  data: any; // 表单默认信息
  loading: boolean; // 加载中
  visible: boolean; // 弹窗显示
  isEdit: boolean; // 是否编辑
};

export type TUseInfoModalOptions = {
  defaultData?: TUseInfoModalStates['data']; // 默认值
  getData?: (data?: any) => void; // 获取数据
  transformer?: (data: any) => any; // 转化数据
  onSubmit: (values: any) => Promise<boolean>; // 保存数据
  getList?: () => void; // 刷新列表数据
};

/**
 * 弹窗表单 Hooks
 */
export const useInfoModal = (options: TUseInfoModalOptions) => {
  const { defaultData, getData, transformer, onSubmit, getList } = options;
  const formRef = useForm();
  const { states, setStates } = useStates<TUseInfoModalStates>({
    data: defaultData,
    loading: false,
    visible: false,
    isEdit: false,
  });
  const { data, loading, visible, isEdit } = states;
  const { form, submit } = formRef;

  /**
   * 显示弹窗
   */
  const show = useCallback(async ({ data, ...states }: Partial<TUseInfoModalStates>) => {
    form.resetFields();
    setLoading(true);
    data = (await getData?.(data)) || data;
    setStates({ data, loading: false, visible: true, ...states });
    form.setFieldsValue(data);
  }, []);

  /**
   * 隐藏弹窗
   */
  const hide = useCallback(() => {
    setStates({ visible: false, loading: false });
  }, []);

  /**
   * 设置加载状态
   */
  const setLoading = useCallback((loading: TUseInfoModalStates['loading']) => setStates({ loading }), []);

  /**
   * 直接展示表单，一般用于新增
   */
  const add = useCallback(async (data?: any) => {
    data = data ? { ...data, ...defaultData } : defaultData;
    await show({ data, isEdit: false });
  }, []);

  /**
   * 写入表单默认数据并展示表单，一般用于编辑
   */
  const edit = useCallback(async (data: any) => {
    data = transformer?.(data) || data;
    await show({ data, isEdit: true });
  }, []);

  /**
   * 表单提交
   */
  const onFinish = async (values: any) => {
    setLoading(true);
    const success = await onSubmit(values);
    if (!success) return setLoading(false);
    message.success(`${isEdit ? '编辑' : '新建'}成功`);
    hide();
    getList?.();
  };

  const formModalProps = {
    form,
    confirmLoading: loading,
    visible,
    onCancel: hide,
    onOk: submit,
    onFinish,
  };

  return { formModalProps, data, isEdit, add, edit, hide, setLoading, formRef, visible };
};
