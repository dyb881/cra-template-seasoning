import { useEffect, useMemo, useCallback } from 'react';
import { useLocation, useHistory, matchPath } from 'react-router-dom';
import { Menu, TMenuData, TMenuProps } from './menu';
import { TRouter } from '../router';
import { useStates } from 'seasoning/es/hooks';

export type TMenuNavData = Pick<TMenuData, 'icon'> & {
  title: string; // 标题
  path?: string; // 注册路由地址
  pagePath?: string; // 绑定组件路径，为空时会尝试使用 path 的路径
  hidden?: boolean; // 不展示到导航菜单
  children?: TMenuNavData[];
  [key: string]: any;
};

export type TMenuNavProps = Omit<TMenuProps, 'data'> & {
  data: TMenuNavData[]; // 导航菜单配置数据，生成菜单后一般无法更改，如果需要更改请在 Menu Props 加上 key
  reload?: () => void; // 刷新
};

type TMenuNavStates = {
  openKeys: any[];
  selectedKeys: any[];
};

/**
 * 导航栏
 * 根据路由自动打开并选中菜单
 */
export const MenuNav: React.FC<TMenuNavProps> = ({ reload, data, ...props }) => {
  const { push } = useHistory();
  const { pathname } = useLocation();
  const { states, setStates } = useStates<TMenuNavStates>({ openKeys: [], selectedKeys: [] });

  const menuNavData = useMemo(() => menuNavDataHidden(data), []);

  /**
   * 点击菜单执行事件并跳转页面
   */
  const onClickItem: TMenuProps['onClickItem'] = (data, key, param) => {
    props.onClickItem?.(data, key, param);
    const { path } = data;
    if (pathname === path) {
      reload?.(); // 跳转地址和当前地址相同，执行刷新
    } else {
      path && push(path); // 跳转对应地址
    }
  };

  /**
   * 菜单开关
   */
  const onOpenChange = useCallback((openKeys: string[]) => setStates({ openKeys }), []);

  /**
   * 监听路由变动，打开和选中菜单项
   */
  useEffect(() => {
    let selectedKey = '';
    const openKeys = [...states.openKeys];

    const getOpenKeys = (data: TMenuNavData[], prefix = 'key') => {
      let isSelect = false; // 该路线是否选中

      data.forEach((i, k) => {
        const key = `${prefix}-${k}`;
        if (matchPath(pathname, { path: i.path, exact: true })) {
          isSelect = true;
          if (!i.hidden) selectedKey = key; // 选中
        } else if (i.children?.length && !isSelect) {
          isSelect = getOpenKeys(i.children, key);
          if (isSelect) {
            // 路线被选中，并且未打开，则 push key
            !openKeys.includes(key) && openKeys.push(key);
            if (!i.hidden && !selectedKey) selectedKey = key; // 选中
          }
        }
      });

      return isSelect;
    };

    getOpenKeys(data);
    setStates({ openKeys, selectedKeys: [selectedKey] });
  }, [pathname]);

  return (
    <Menu
      {...props}
      {...states}
      onOpenChange={onOpenChange}
      data={menuNavData as TMenuData[]}
      onClickItem={onClickItem}
    />
  );
};

/**
 * 隐藏数据中 hidden === true 的项
 */
export const menuNavDataHidden = (data: TMenuNavData[]) => {
  return data
    .filter((i) => !i.hidden)
    .map((i) => {
      if (i.children) i = { ...i, children: menuNavDataHidden(i.children) };
      return i;
    });
};

/**
 * 获取导航数据中路由信息
 */
export const getMenuNavDataRouters = (data: TMenuNavData[]) => {
  let routers: TRouter[] = [];
  for (let { path, pagePath, title, children } of data) {
    path && routers.push({ path, pagePath: pagePath || path.split('/:')[0], title });
    if (children) routers = [...routers, ...getMenuNavDataRouters(children)];
  }
  return routers;
};

/**
 * 获取导航数据中路由地址匹配的标题
 */
export const getMenuNavDataTitle = (data: TMenuNavData[], pathname: string) => {
  let menuNavDatatitle = '';
  for (let i of data) {
    const { path, title, children } = i;
    if (matchPath(pathname, { path, exact: true })) {
      menuNavDatatitle = title;
    } else if (!menuNavDatatitle && children?.length) {
      menuNavDatatitle = getMenuNavDataTitle(children, pathname);
    }
  }
  return menuNavDatatitle;
};

/**
 * 获取导航数据中路由地址匹配的数组
 */
export const getMenuNavDatas = (data: TMenuNavData[], pathname: string) => {
  let menuNavDatas: TMenuNavData[] = [];
  for (let i of data) {
    const { path, children } = i;
    if (matchPath(pathname, { path, exact: true })) {
      menuNavDatas.push(i);
    } else if (children?.length) {
      const childrenMenuNavDatas = getMenuNavDatas(children, pathname);
      childrenMenuNavDatas.length && menuNavDatas.push(i, ...childrenMenuNavDatas);
    }
  }
  return menuNavDatas;
};
