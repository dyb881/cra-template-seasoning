import React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';
import { ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * 确认对话框
 */
export const modalConfirm = (funcProps: ModalFuncProps) => {
  Modal.confirm({ icon: <ExclamationCircleOutlined />, ...funcProps });
};

/**
 * 创建询问函数，每次执行都会弹出对话框
 */
export const createModal = (funcProps?: ModalFuncProps) => {
  return <T extends any[]>(fun: (...arg: T) => void | Promise<void>) => {
    return (...arg: T) => {
      modalConfirm({
        onOk: () => fun(...arg),
        ...funcProps,
      });
    };
  };
};

/**
 * 每次执行都会弹出删除对话框
 */
export const modalDel = createModal({
  title: '确定要删除吗？',
  content: '删除后数据将无法恢复',
  okButtonProps: { danger: true },
});
