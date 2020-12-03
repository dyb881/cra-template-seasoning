import React, { useMemo } from 'react';
import { Menu as MenuSource } from 'antd';
import { MenuProps } from 'antd/es/menu';

export type TMenuData = {
  icon?: React.ReactNode;
  title: React.ReactNode; // 标题
  children?: TMenuData[];
  [key: string]: any;
};

export type TMenuProps = Omit<MenuProps, 'onOpenChange'> & {
  data: TMenuData[]; // 导航菜单配置数据，生成菜单后一般无法更改，如果需要更改请在 Menu Props 加上 key
  onClickItem?: (data: TMenuData, key: React.ReactText, param: any) => void; // 点击导航菜单 item
  onOpenChange?: (openKeys: string[]) => void;
};

/**
 * 导航菜单
 * 根据配置，可无限生成子菜单
 */
export const Menu: React.FC<TMenuProps> = ({
  data,
  onClickItem,
  onClick,
  inlineCollapsed,
  openKeys,
  onOpenChange,
  ...props
}) => {
  const children = useMemo(() => menuTree(data), []);

  const computeProps = inlineCollapsed
    ? {}
    : {
        openKeys,
        onOpenChange: (keys: any | any[]) => {
          onOpenChange?.(Array.isArray(keys) ? keys.map(String) : [keys.key]);
        },
      };

  const menuOnClick = (param: any) => {
    const { item, key } = param;
    onClickItem?.(item.props['data-info'], key, param);
    onClick?.(param);
  };

  return (
    <MenuSource onClick={menuOnClick} {...computeProps} {...props}>
      {children}
    </MenuSource>
  );
};

/**
 * 递归生成子菜单
 */
const menuTree = (data: TMenuData[], prefix = 'key') => {
  return data.map((i, k) => {
    const { title, icon, children } = i;
    const key = `${prefix}-${k}`;
    const menuItemTitle = (
      <>
        {icon}
        <span>{title}</span>
      </>
    );
    return children?.length ? (
      <MenuSource.SubMenu key={key} title={menuItemTitle}>
        {menuTree(children, key)}
      </MenuSource.SubMenu>
    ) : (
      <MenuSource.Item key={key} data-info={i}>
        {menuItemTitle}
      </MenuSource.Item>
    );
  });
};
