import { Badge } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Action, PreviewColumn } from 'components';

/**
 * 生成表格配置数据
 */
export const createColumns = ({ add, edit, del }: any) => {
  const columns: ColumnsType = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 400,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 60,
      render: (v) => <PreviewColumn src={v} name="图标" />,
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: 200,
      ellipsis: true,
    },
    { title: '创建帐号', dataIndex: 'create_username', width: 120 },
    { title: '更新帐号', dataIndex: 'update_username', width: 120 },
    { title: '创建时间', dataIndex: 'create_date', width: 180 },
    { title: '更新时间', dataIndex: 'update_date', width: 180 },
    { title: '优先级', dataIndex: 'priority', width: 90, fixed: 'right' },
    { title: '状态', dataIndex: 'status', width: 80, fixed: 'right', render: (v) => renders.status[v] },
    {
      title: '操作',
      key: 'action',
      width: 210,
      fixed: 'right',
      render: (data) => (
        <Action>
          <span className="success pointer" onClick={() => add({ pid: data.id })}>
            添加子菜单
          </span>
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
  status: ['隐藏', '显示'],
};

export const renders = {
  status: [<Badge status="default" text="隐藏" />, <Badge status="success" text="显示" />],
};
