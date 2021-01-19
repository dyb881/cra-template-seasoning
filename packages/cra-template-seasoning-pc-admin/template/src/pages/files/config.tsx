import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Action, PreviewColumn } from 'components';
import filesize from 'filesize';

const { Text } = Typography;

/**
 * 生成表格配置数据
 */
export const createColumns = ({ fileType, edit, del }: any) => {
  const columns: ColumnsType = [
    {
      title: '预览',
      key: 'preview',
      width: 60,
      fixed: 'left',
      render: ({ url: src, type, name }) => <PreviewColumn {...{ src, type, name }} />,
    },
    {
      title: '文件名',
      dataIndex: 'name',
      width: 200,
      render: (v) => (
        <Text ellipsis copyable>
          {v}
        </Text>
      ),
    },
    {
      title: '文件地址',
      dataIndex: 'url',
      width: 300,
      render: (v) => (
        <Text ellipsis copyable>
          {v}
        </Text>
      ),
    },
    { title: '文件类型', dataIndex: 'type', width: 90, render: (v) => fileType?.[v] },
    { title: '储存', dataIndex: 'store', width: 90, render: (v: keyof typeof options.store) => options.store[v] },
    { title: '文件大小', dataIndex: 'size', width: 120, render: (v) => filesize(v) },
    { title: '上传时间', dataIndex: 'create_date', width: 180 },
    { title: '更新时间', dataIndex: 'update_date', width: 180 },
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
  store: { network: '网络图片', server: '本地储存', oss: 'OSS' },
};
