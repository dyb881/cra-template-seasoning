import React, { useMemo } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Breadcrumb as BreadcrumbSource } from 'antd';
import { BreadcrumbProps, BreadcrumbItemProps } from 'antd/es/breadcrumb';

export type TBreadcrumbItemProps = Partial<LinkProps> & { itemProps?: BreadcrumbItemProps };

export type TBreadcrumbProps = BreadcrumbProps & { data: TBreadcrumbItemProps[] };

/**
 * 面包屑
 * 可由配置生成可跳转的面包屑
 */
export const Breadcrumb: React.FC<TBreadcrumbProps> = ({ data, ...props }) => {
  const breadcrumbItems = useMemo(
    () =>
      data.map(({ itemProps, to, children, ...i }, k) => (
        <BreadcrumbSource.Item key={k} {...itemProps}>
          {to ? (
            <Link to={to} {...i}>
              {children}
            </Link>
          ) : (
            children
          )}
        </BreadcrumbSource.Item>
      )),
    [JSON.stringify(data)]
  );

  return <BreadcrumbSource {...props}>{breadcrumbItems}</BreadcrumbSource>;
};
