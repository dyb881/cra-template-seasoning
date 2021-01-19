import { useMemo } from 'react';
import { useTable, PageTable } from 'components';
import { createColumns } from './config';
import { useInfo } from './info_modal';
import { account } from 'apis';

const Page = () => {
  const { setData, pageTableProps, getList, del } = useTable({
    onList: async () => {
      const res = await account.admin.role.getList();
      res.ok && setData(res.data);
    },
    onDel: async (ids) => {
      const res = await account.admin.role.del(ids);
      return res.ok;
    },
  });

  // 弹窗表单
  const { modalForm, add, edit } = useInfo(getList);

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ edit, del }), []);

  return (
    <PageTable {...pageTableProps} columns={columns} add={add}>
      {modalForm}
    </PageTable>
  );
};

export default Page;
