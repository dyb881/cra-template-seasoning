import { useMemo } from 'react';
import { FormItem } from 'common/antd';
import { useTable, PageTable, FormSearch } from 'components';
import { createColumns } from './config';
import { useInfo } from './info_modal';
import { account } from 'apis';

const Page = () => {
  const { setData, pageTableProps, formSearchProps, getList, del, DelButton } = useTable({
    onList: async ({ current, pageSize, search }) => {
      const res = await account.user.getList({ current, pageSize, ...search });
      res.ok && setData(res.data.list, res.data.total);
    },
    onDel: async (ids) => {
      const res = await account.user.del(ids);
      return res.ok;
    },
  });

  // 弹窗表单
  const { modalForm, add, edit } = useInfo(getList);

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ edit, del }), []);

  return (
    <PageTable {...pageTableProps} columns={columns} add={add} extra={<DelButton />}>
      <FormSearch {...formSearchProps}>
        <FormItem label="用户名" name="username" placeholder />
        <FormItem label="手机号" name="phone" placeholder />
        <FormItem label="昵称" name="nickname" placeholder />
      </FormSearch>
      {modalForm}
    </PageTable>
  );
};

export default Page;
