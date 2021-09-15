import { useMemo } from 'react';
import { FormItem, Select } from 'common/antd';
import { useTable, PageTable, FormSearch } from 'components';
import { createColumns, options } from './config';
import { SelectCategory } from '../category/select';
import { infos } from 'apis';

const Page = () => {
  const { states, setStates, setData, pageTableProps, formSearchProps, del, DelButton } = useTable({
    onList: async ({ menuData, current, pageSize, search }) => {
      if (!menuData) {
        const res = await infos.category.getList();
        if (res.ok) {
          const menuData: any = {};
          res.data.forEach(({ id, title }: any) => {
            menuData[id] = title;
          });
          setStates({ menuData });
        }
      }

      const res = await infos.article.getList({ current, pageSize, ...search });
      res.ok && setData(res.data.list, res.data.total);
    },
    onDel: async (ids) => {
      const res = await infos.article.del(ids);
      return res.ok;
    },
  });
  const { menuData } = states;

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ del, menuData }), [!menuData]);

  return (
    <PageTable {...pageTableProps} columns={columns} extra={<DelButton />} add="/infos/article/info" paginationClose>
      <FormSearch {...formSearchProps}>
        <FormItem label="所属菜单" name="categoryId" placeholder select>
          <SelectCategory style={{ minWidth: 200 }} />
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
