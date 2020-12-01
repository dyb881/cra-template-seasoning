import { FC } from 'react';
import { Form, Input, Button } from 'antd';
import { FormInstance } from 'antd/es/form';
import { FormItemProps } from 'antd/es/form/FormItem';
import { TFormEnhance, TFormItemPropsEnhance, useFormEnhance, formItemEnhance } from 'seasoning/es/form-enhance';

// ------------------------ 类型增强 ------------------------ //

export type TForm = TFormEnhance<FormInstance>;

export type TFormItemProps = TFormItemPropsEnhance<FormItemProps>;

// ------------------------ 类型增强 ------------------------ //

// ------------------------ 表单增强 ------------------------ //

export const useForm = useFormEnhance<TForm>(Form.useForm);

export const FormItem = formItemEnhance<TFormItemProps>(Form.Item, () => <input />);

// ------------------------ 表单增强 ------------------------ //
