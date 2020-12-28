import { useRef } from 'react';
import { Modal, ConfigProvider } from 'antd';
import { FormProps } from 'antd/es/form';
import { ModalProps } from 'antd/es/modal';
import { SaveOutlined } from '@ant-design/icons';
import { FormMobile } from '../layout';

export type TFormLayoutProps = FormProps & {
  maxWidth?: number;
  cols: [number, number]; // 宽度比
};

/**
 * 表单布局
 */
export const FormLayout: React.FC<TFormLayoutProps> = ({ maxWidth, cols, title, ...props }) => {
  return (
    <FormMobile
      layout="horizontal"
      style={{ maxWidth }}
      labelCol={{ span: cols[0] }}
      wrapperCol={{ span: cols[1] }}
      {...props}
    />
  );
};

export type TFormModal = Pick<ModalProps, 'title' | 'visible' | 'onOk' | 'onCancel' | 'width' | 'confirmLoading'> &
  Partial<Omit<TFormLayoutProps, 'title'>> & {
    modalProps?: ModalProps;
  };

/**
 * 表单弹窗
 */
export const FormModal: React.FC<TFormModal> = ({
  title,
  visible,
  onOk,
  onCancel,
  width,
  confirmLoading,
  modalProps,
  cols = [5, 16],
  ...props
}) => {
  const box = useRef<HTMLDivElement>(null);

  return (
    <Modal
      maskClosable={false}
      okText="保存"
      okButtonProps={{ icon: <SaveOutlined /> }}
      {...{ title, visible, onOk, onCancel, width, confirmLoading }}
      {...modalProps}
    >
      <ConfigProvider getPopupContainer={() => box.current || document.body}>
        <div ref={box}>
          <FormLayout cols={cols} name="formModal" {...props} />
        </div>
      </ConfigProvider>
    </Modal>
  );
};
