import { useMemo } from 'react';
import { FormItem, Select } from 'common/antd';
import { useTable, PageTable, FormSearch } from 'components';
import { options, createColumns } from './config';
import { menu, info } from 'apis';
import { SelectMenu } from 'pages/menu/select';

const Page = () => {
  const { states, setStates, setData, pageTableProps, formSearchProps, del, DelButton } = useTable({
    onList: async ({ menuData, current, pageSize, search }) => {
      if (!menuData) {
        const res = await menu.getList();
        if (res.ok) {
          const menuData: any = {};
          res.data.forEach(({ id, title }: any) => {
            menuData[id] = title;
          });
          setStates({ menuData });
        }
      }

      const res = await info.getList({ current, pageSize, ...search });
      res.ok && setData(res.data.list, res.data.total);
    },
    onDel: async (ids) => {
      const res = await info.del(ids);
      return res.ok;
    },
  });
  const { menuData } = states;

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ del, menuData }), [!menuData]);

  return (
    <PageTable {...pageTableProps} columns={columns} extra={<DelButton />} add="/info/info">
      <FormSearch {...formSearchProps}>
        <FormItem label="所属菜单" name="menu_id" placeholder select>
          <SelectMenu style={{ minWidth: 200 }} />
        </FormItem>
        <FormItem label="标题" name="title" placeholder />
        <FormItem label="简介" name="summary" placeholder />
        <FormItem label="内容" name="content" placeholder />
        <FormItem label="状态" name="status" placeholder select>
          <Select options={options.status} />
        </FormItem>
      </FormSearch>
    </PageTable>
  );
};

export default Page;
