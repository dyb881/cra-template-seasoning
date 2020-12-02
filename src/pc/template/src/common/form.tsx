import { Form as FormSource, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import { FormItemProps } from 'antd/es/form/FormItem';
import { TFormEnhance, TFormItemPropsEnhance, useFormEnhance, formItemEnhance } from 'seasoning/es/form-enhance';

// ------------------------ 类型增强 ------------------------ //

export type TForm = TFormEnhance<FormInstance>;

export type TFormItemProps = TFormItemPropsEnhance<FormItemProps>;

// ------------------------ 类型增强 ------------------------ //

// ------------------------ 表单增强 ------------------------ //

export const useForm = useFormEnhance<TForm>(FormSource.useForm);

export const FormItem = formItemEnhance<TFormItemProps>(FormSource.Item, () => <Input />);

export const Form = FormSource;

// ------------------------ 表单增强 ------------------------ //
