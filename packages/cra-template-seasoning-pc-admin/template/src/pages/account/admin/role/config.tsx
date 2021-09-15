import { ColumnsType } from 'antd/es/table';
import { Action } from 'components';

/**
 * 生成表格配置数据
 */
export const createColumns = ({ edit, del }: any) => {
  const columns: ColumnsType = [
    { title: '角色名称', dataIndex: 'name' },
    {
      title: '操作',
      key: 'action',
      width: 125,
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
