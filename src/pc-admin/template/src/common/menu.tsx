import { UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
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
      { path: '/account/admin/role', permission: 'account.adminRole.query', title: '管理员角色' },
      { path: '/account/admin', permission: 'account.admin.query', title: '管理员账号' },
      { path: '/account/user', permission: 'account.user.query', title: '用户账号' },
    ],
  },
  {
    icon: <UnorderedListOutlined />,
    title: '信息管理',
    children: [
      { path: '/infos/category', title: '分类管理', permission: 'infos.category.query' },
      {
        path: '/infos/article',
        title: '文章管理',
        permission: 'infos.article.query',
        children: [
          { path: '/infos/article/info', title: '添加文章', hidden: true },
          { path: '/infos/article/info/:id', title: '编辑文章', hidden: true },
        ],
      },
    ],
  },
];
