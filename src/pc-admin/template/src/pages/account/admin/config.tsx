import { ColumnsType } from 'antd/es/table';
import { Action, PreviewColumn } from 'components';
import { renders, getAccountFormData } from '../config';

/**
 * 生成表格配置数据
 */
export const createColumns = ({ edit, del, roleData = {} }: any) => {
  const columns: ColumnsType = [
    { title: '用户名', dataIndex: ['account', 'username'], width: 120, fixed: 'left' },
    { title: '昵称', dataIndex: ['account', 'nickname'], width: 160 },
    { title: '手机号', dataIndex: ['account', 'phone'], width: 160 },
    {
      title: '头像',
      dataIndex: ['account', 'avatar'],
      width: 60,
      render: (v) => <PreviewColumn src={v} name="头像" />,
    },
    { title: '角色', dataIndex: 'roleId', width: 120, render: (v) => roleData[v] },
    { title: '注册IP', dataIndex: ['account', 'reg_ip'], width: 160 },
    { title: '登陆IP', dataIndex: ['account', 'login_ip'], width: 160 },
    { title: '登陆时间', dataIndex: ['account', 'login_date'], width: 180 },
    { title: '注册时间', dataIndex: 'create_date', width: 180 },
    { title: '更新时间', dataIndex: 'update_date', width: 180 },
    { title: '状态', dataIndex: ['account', 'status'], width: 90, fixed: 'right', render: (v) => renders.status[v] },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (data) => (
        <Action>
          <span className="edit pointer" onClick={() => edit(getAccountFormData(data))}>
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
