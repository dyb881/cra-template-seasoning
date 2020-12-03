import React from 'react';
import { Spin as SpinSource } from 'antd';
import { SpinProps } from 'antd/es/spin';

export type TSpinProps = SpinProps & {
  loading?: boolean | string;
};

/**
 * 加载中
 */
export const Spin: React.FC<TSpinProps> = ({ loading, ...props }) => {
  return <SpinSource spinning={!!loading} tip={typeof loading === 'string' ? loading : undefined} {...props} />;
};
