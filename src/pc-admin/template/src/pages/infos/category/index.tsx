import { useMemo } from 'react';
import { FormItem, Select } from 'common/antd';
import { useTable, PageTable, FormSearch } from 'components';
import { createColumns, options } from './config';
import { useInfo } from './info_modal';
import { toThree } from './select';
import { infos } from 'apis';

const Page = () => {
  const { states, setData, pageTableProps, formSearchProps, del, DelButton, getList } = useTable({
    onList: async ({ search }) => {
      const res = await infos.category.getList(search);
      res.ok && setData(res.data);
    },
    onDel: async (ids) => {
      const res = await infos.category.del(ids);
      return res.ok;
    },
  });

  // 弹窗表单
  const { modalForm, add, edit } = useInfo(getList);

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ add, edit, del }), []);

  const dataSource = toThree(states.dataSource);

  return (
    <PageTable
      {...pageTableProps}
      key={dataSource.length}
      dataSource={dataSource}
      columns={columns}
      extra={<DelButton />}
      add={add}
      paginationClose
    >
      <FormSearch {...formSearchProps}>
        <FormItem label="标题" name="title" placeholder />
        <FormItem label="简介" name="summary" placeholder />
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
