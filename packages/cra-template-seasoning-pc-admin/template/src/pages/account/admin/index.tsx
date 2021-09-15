import { useMemo } from 'react';
import { FormItem, Select } from 'common/antd';
import { useTable, PageTable, FormSearch } from 'components';
import { combine } from 'stores';
import { SelectAdminRole } from './role/select';
import { createColumns } from './config';
import { useInfo } from './info_modal';
import { options } from './config';
import { account } from 'apis';

const Page = combine(({ stores }) => {
  const { info, getInfo } = stores.user;
  const { states, setStates, setData, pageTableProps, formSearchProps, getList, del, DelButton } = useTable({
    onList: async ({ roleData, current, pageSize, search }) => {
      if (!roleData) {
        const res = await account.admin.role.getList();
        if (res.ok) {
          const roleData: any = {};
          res.data.forEach(({ id, name }: any) => {
            roleData[id] = name;
          });
          setStates({ roleData });
        }
      }

      const res = await account.admin.getList({ current, pageSize, ...search });
      res.ok && setData(res.data.list, res.data.total);
    },
    onDel: async (ids) => {
      const res = await account.admin.del(ids);
      return res.ok;
    },
  });
  const { roleData } = states;

  // 弹窗表单
  const { modalForm, add, edit } = useInfo(getList, (username) => {
    // 如果编辑的是当前账号，则刷新用户信息
    info.account.username === username && getInfo();
  });

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ edit, del, roleData }), [!roleData]);

  return (
    <PageTable {...pageTableProps} columns={columns} add={add} extra={<DelButton />}>
      <FormSearch {...formSearchProps}>
        <FormItem label="用户名" name="username" placeholder />
        <FormItem label="手机号" name="phone" placeholder />
        <FormItem label="昵称" name="nickname" placeholder />
        <FormItem label="状态" name="status" placeholder select>
          <Select options={options.status} />
        </FormItem>
        <FormItem label="角色" name="roleId" placeholder select>
          <SelectAdminRole />
        </FormItem>
      </FormSearch>
      {modalForm}
    </PageTable>
  );
});

export default Page;
