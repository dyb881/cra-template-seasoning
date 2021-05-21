import { FC } from 'react';
import { TSpinProps } from 'common/antd';
import { RouterPageHeader, TRouterPageHeaderProps, Loading, ConfigProviderBox } from '../layout';

export type TPageDetailsProps = Pick<TSpinProps, 'loading'> &
  Pick<TRouterPageHeaderProps, 'onBack' | 'extra'> & {
    headerChildren?: React.ReactNode;
  };

/**
 * 表格页
 */
export const PageDetails: FC<TPageDetailsProps> = ({ loading, onBack = true, extra, headerChildren, children }) => {
  return (
    <>
      <RouterPageHeader onBack={onBack} extra={extra} children={headerChildren} />
      <ConfigProviderBox className="page-fill">{children}</ConfigProviderBox>
      <Loading loading={loading} />
    </>
  );
};
