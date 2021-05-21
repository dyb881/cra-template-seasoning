import { forwardRef, useImperativeHandle } from 'react';
import { Button, Space } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { TForm, useForm, TSpinProps, TFormItemProps, FormItem } from 'common/antd';
import { combine } from 'stores';
import { RouterPageHeader, TRouterPageHeaderProps, Loading, ConfigProviderBox } from '../layout';
import { FormLayout, TFormLayoutProps } from './common';

export type TPageFormProps = Pick<TSpinProps, 'loading'> &
  Pick<TRouterPageHeaderProps, 'onBack' | 'extra'> &
  Partial<TFormLayoutProps> & {
    headerChildren?: React.ReactNode;
    hiddenButtons?: boolean;
  };

/**
 * 表格页
 */
export const PageForm = forwardRef<TForm, TPageFormProps>(
  (
    {
      loading,
      onBack = true,
      extra,
      headerChildren,
      hiddenButtons,
      children,
      maxWidth = 750,
      cols = [3, 14],
      ...props
    },
    ref
  ) => {
    const formRef = useForm();
    const { form, reset } = formRef;

    useImperativeHandle(ref, () => formRef);

    const [offset, span] = cols;

    return (
      <>
        <RouterPageHeader onBack={onBack} extra={extra} children={headerChildren} />
        <ConfigProviderBox className="page-fill">
          <FormLayout name="pageForm" {...{ form, maxWidth, cols }} {...props}>
            <div style={{ height: 30 }} />
            {children}
            <FormButtons formItemProps={{ wrapperCol: { offset, span } }} hidden={hiddenButtons}>
              <Space>
                <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                  保存
                </Button>
                <Button icon={<UndoOutlined />} onClick={reset}>
                  重置
                </Button>
              </Space>
            </FormButtons>
          </FormLayout>
        </ConfigProviderBox>
        <Loading loading={loading} />
      </>
    );
  }
);

export const FormButtons = combine<TFormItemProps>(({ stores, formItemProps, ...props }) => {
  return <FormItem formItemProps={stores.layout.isMobile ? undefined : formItemProps} {...props} />;
});
