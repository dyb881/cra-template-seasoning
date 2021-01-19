import { Tag, Badge } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Action, PreviewColumn } from 'components';
import { pick } from 'lodash';

/**
 * 生成表格配置数据
 */
export const createColumns = ({ edit, del }: any) => {
  const columns: ColumnsType = [
    { title: '用户名', dataIndex: 'username', width: 120, fixed: 'left' },
    { title: '昵称', dataIndex: 'nickname', width: 160 },
    { title: '手机号', dataIndex: 'phone', width: 160 },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 60,
      render: (v) => <PreviewColumn src={v} name="头像" />,
    },
    { title: '注册IP', dataIndex: 'reg_ip', width: 160 },
    { title: '登陆IP', dataIndex: 'login_ip', width: 160 },
    { title: '登陆时间', dataIndex: 'login_date', width: 180 },
    { title: '注册时间', dataIndex: 'create_date', width: 180 },
    { title: '更新时间', dataIndex: 'update_date', width: 180 },
    {
      title: '帐号类型',
      dataIndex: 'type',
      width: 90,
      fixed: 'right',
      render: (v: keyof typeof renders.type) => renders.type[v],
    },
    { title: '状态', dataIndex: 'status', width: 90, fixed: 'right', render: (v) => renders.status[v] },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (data) => (
        <Action>
          <span className="edit pointer" onClick={() => edit(data)}>
            编辑
          </span>
          <span className="delete pointer" onClick={() => del([data.id])}>
            删除
          </span>
        </Action>
      ),
    },
  ];

  return columns;
};

export const options = {
  type: { admin: '管理员', user: '用户' },
  status: ['未审核', '已审核', '冻结'],
};

export const renders = {
  type: {
    admin: <Tag color="orange">管理员</Tag>,
    user: <Tag color="green">用户</Tag>,
  },
  status: [
    <Badge status="default" text="未审核" />,
    <Badge status="success" text="已审核" />,
    <Badge status="error" text="冻结" />,
  ],
};

const accountFormNames = ['avatar', 'username', 'phone', 'nickname', 'status'];

export const getAccountFormData = (data: any) => {
  return { ...data, ...pick(data.account, accountFormNames) };
};
