import React, { useMemo } from 'react';
import { FormItem, Select } from 'common/antd';
import { useTable, PageTable, FormSearch } from 'components';
import { createColumns, options } from './config';
import { useInfo } from './info_modal';
import { toThree } from './select';
import { menu } from 'apis';

const Page = () => {
  const { states, setData, pageTableProps, formSearchProps, getList, del, DelButton } = useTable({
    onList: async ({ search }) => {
      const res = await menu.getList(search);
      res.ok && setData(res.data);
    },
    onDel: async (ids) => {
      const res = await menu.del(ids);
      return res.ok;
    },
  });

  // 弹窗表单
  const { modalForm, add, edit } = useInfo(getList);

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ add, edit, del }), []);

  return (
    <PageTable
      {...pageTableProps}
      dataSource={toThree(states.dataSource)}
      columns={columns}
      extra={<DelButton />}
      add={() => add()}
      paginationClose
    >
      <FormSearch {...formSearchProps}>
        <FormItem label="标题" name="title" placeholder />
        <FormItem label="内容" name="content" placeholder />
        <FormItem label="状态" name="status" placeholder select>
          <Select options={options.status} />
        </FormItem>
      </FormSearch>
      {modalForm}
    </PageTable>
  );
};

export default Page;
