import { Form as FormSource } from 'antd';
import { Input } from './antd/input';
import { NamePath, InternalNamePath } from 'rc-field-form/es/interface';
import { FormInstance } from 'antd/es/form';
import { FormItemProps } from 'antd/es/form/FormItem';
import { TFormEnhance, TFormItemPropsEnhance, useFormEnhance, formItemEnhance } from 'seasoning/es/form-enhance';

// ------------------------ 处理 Antd 未同步 rc-field-form 最新版本的类型 ------------------------ //

export interface FieldError {
  name: InternalNamePath;
  errors: string[];
  warnings: string[];
}

interface FormInstances extends FormInstance {
  getFieldWarning: (name: NamePath) => string[];
  getFieldsError: (nameList?: NamePath[]) => FieldError[];
}

// ------------------------ 处理 Antd 未同步 rc-field-form 最新版本的类型 ------------------------ //

// ------------------------ 类型增强 ------------------------ //

export interface FieldError {
  name: InternalNamePath;
  errors: string[];
  warnings: string[];
}

interface FormInstances extends FormInstance {
  getFieldWarning: (name: NamePath) => string[];
  getFieldsError: (nameList?: NamePath[]) => FieldError[];
}

export type TForm = TFormEnhance<FormInstances>;

export type TFormItemProps = TFormItemPropsEnhance<FormItemProps>;

// ------------------------ 类型增强 ------------------------ //

// ------------------------ 表单增强 ------------------------ //

export const useForm = useFormEnhance<TForm>(FormSource.useForm);

export const FormItem = formItemEnhance<TFormItemProps>(FormSource.Item, () => <Input />, { validateFirst: true });

export const Form = FormSource;

// ------------------------ 表单增强 ------------------------ //
