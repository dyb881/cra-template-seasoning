import { UserOutlined, UnorderedListOutlined, FolderFilled } from '@ant-design/icons';
import { TMenuNavData } from './antd';

/**
 * 左侧导航数据和标题数据
 * path 是相对 /src/pages 引用文件的路径
 */
export const menuData: TMenuNavData[] = [
  {
    icon: <UserOutlined />,
    title: '账号管理',
    children: [
      { path: '/account', permission: 'account.account.query', title: '基础账号' },
      { path: '/account/admin/role', permission: 'account.roleAdmin.query', title: '管理员角色' },
      { path: '/account/admin', permission: 'account.admin.query', title: '管理员账号' },
      { path: '/account/user', permission: 'account.user.query', title: '用户账号' },
    ],
  },
  {
    icon: <FolderFilled />,
    title: '文件管理',
    children: [
      { path: '/files', permission: 'files.files.query', title: '文件信息' },
      { path: '/files/configs', permission: 'files.config.query', title: '文件配置' },
    ],
  },
  {
    icon: <UnorderedListOutlined />,
    title: '信息管理',
    children: [
      {
        path: '/infos/category',
        title: '分类管理',
        permission: 'infos.category.query',
        children: [
          { path: '/infos/category/info', title: '添加分类', hidden: true },
          {
            pagePath: '/infos/category/info',
            path: '/infos/category/info/add/:parentId',
            title: '添加分类',
            hidden: true,
          },
          { path: '/infos/category/info/:id', title: '编辑分类', hidden: true },
        ],
      },
      {
        path: '/infos/information',
        title: '信息列表',
        permission: 'infos.information.query',
        children: [
          { path: '/infos/information/info', title: '添加信息', hidden: true },
          { path: '/infos/information/info/:id', title: '编辑信息', hidden: true },
        ],
      },
    ],
  },
];
