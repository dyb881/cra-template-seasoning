import React from 'react';
import { UserOutlined, FolderFilled, UnorderedListOutlined, SettingOutlined } from '@ant-design/icons';
import { TMenuNavData } from './antd';

/**
 * 左侧导航数据和标题数据
 * 除了菜单导航数据外，path 是相对 /src/pages 引用文件的路径
 */
export const menuData: TMenuNavData[] = [
  {
    icon: <UserOutlined />,
    title: '账号管理',
    children: [{ path: '/account', title: '所有账号' }],
  },
  {
    icon: <FolderFilled />,
    title: '文件管理',
    children: [{ path: '/uploadFile', title: '文件列表' }],
  },
  {
    icon: <UnorderedListOutlined />,
    title: '信息管理',
    children: [
      { path: '/menu', title: '菜单分类' },
      {
        path: '/info',
        title: '信息列表',
        children: [
          { path: '/info/info', title: '新建信息', hidden: true },
          { path: '/info/info/:id', title: '编辑信息', hidden: true },
        ],
      },
    ],
  },
  {
    icon: <SettingOutlined />,
    title: '设置',
    children: [{ path: '/setUp/userCenter', title: '个人中心' }],
  },
];
