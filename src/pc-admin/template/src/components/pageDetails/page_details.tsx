import { FC } from 'react';
import { TSpinProps } from 'common/antd';
import { RouterPageHeader, TRouterPageHeaderProps, Loading } from '../layout';

export type TPageDetailsProps = Pick<TSpinProps, 'loading'> & Pick<TRouterPageHeaderProps, 'onBack' | 'extra'>;

/**
 * 表格页
 */
export const PageDetails: FC<TPageDetailsProps> = ({ loading, onBack = true, extra, children }) => {
  return (
    <>
      <RouterPageHeader onBack={onBack} extra={extra} />
      {children}
      <Loading loading={loading} />
    </>
  );
};
