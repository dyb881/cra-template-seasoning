import { FC } from 'react';
import { Toast } from 'antd-mobile';
import FormSource, { FormInstance, useForm as useFormSource, Field } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/es/Field';
import { FormProps } from 'rc-field-form/es/Form';
import { ValidateErrorEntity } from 'rc-field-form/es/interface';
import { TFormEnhance, TFormItemPropsEnhance, useFormEnhance, formItemEnhance } from 'seasoning/es/form-enhance';

// ------------------------ 类型增强 ------------------------ //

export type TForm = TFormEnhance<FormInstance>;

export type TFormItemProps = TFormItemPropsEnhance<FieldProps>;

// ------------------------ 类型增强 ------------------------ //

// ------------------------ 表单增强 ------------------------ //

export const useForm = useFormEnhance<TForm>(useFormSource);

export const FormItem = formItemEnhance<TFormItemProps>(Field, () => <input />);

export const Form: FC<FormProps> = (props) => {
  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    Toast.info(errorInfo.errorFields[0].errors[0], 1);
    console.log(1);
  };

  return <FormSource onFinishFailed={onFinishFailed} {...props} />;
};

// ------------------------ 表单增强 ------------------------ //
