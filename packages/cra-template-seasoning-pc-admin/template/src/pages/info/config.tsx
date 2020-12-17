import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Action, PreviewColumn } from 'components';

/**
 * 生成表格配置数据
 */
export const createColumns = ({ del, menuData = {} }: any) => {
  const columns: ColumnsType = [
    {
      title: '所属菜单',
      dataIndex: 'menu_id',
      width: 200,
      ellipsis: true,
      render: (v) => menuData[v],
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 60,
      render: (v) => <PreviewColumn src={v} name="图标" />,
    },
    {
      title: '图组',
      dataIndex: 'picture_group',
      width: 60,
      render: (v) => <PreviewColumn src={v} name="图组" type="imageGroup" />,
    },
    {
      title: '简介',
      dataIndex: 'summary',
      width: 200,
      ellipsis: true,
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
    { title: '热度', dataIndex: 'hot', width: 90, fixed: 'right' },
    { title: '优先级', dataIndex: 'priority', width: 90, fixed: 'right' },
    { title: '状态', dataIndex: 'status', width: 90, fixed: 'right', render: (v) => renders.status[v] },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (data) => (
        <Action>
          <Link className="edit" to={`/info/info/${data.id}`}>
            编辑
          </Link>
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
