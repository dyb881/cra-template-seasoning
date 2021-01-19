import { useMemo } from 'react';
import { FormItem, Select } from 'common/antd';
import { useTable, PageTable, FormSearch } from 'components';
import { options, createColumns } from './config';
import { useInfo } from './info_modal';
import { files } from 'apis';

const Page = () => {
  const { states, setStates, setData, pageTableProps, formSearchProps, getList, del, DelButton } = useTable({
    onList: async ({ fileType, current, pageSize, search }) => {
      if (!fileType) {
        const res = await files.config.get();
        if (res.ok) {
          const fileType: any = {};
          res.data.filesConfig.forEach((i: any) => {
            fileType[i.type] = i.name;
          });
          setStates({ fileType });
        }
      }

      const res = await files.getList({ current, pageSize, ...search });
      res.ok && setData(res.data.list, res.data.total);
    },
    onDel: async (ids) => {
      const res = await files.del(ids);
      return res.ok;
    },
  });
  const { fileType } = states;

  // 弹窗表单
  const { modalForm, add, edit } = useInfo(getList, fileType);

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ fileType, edit, del }), [!fileType]);

  return (
    <PageTable {...pageTableProps} columns={columns} add={add} extra={<DelButton />}>
      <FormSearch {...formSearchProps}>
        <FormItem label="文件名" name="name" placeholder />
        <FormItem label="文件类型" name="type" placeholder select>
          <Select options={fileType} />
        </FormItem>
        <FormItem label="储存" name="store" placeholder select>
          <Select options={options.store} />
        </FormItem>
      </FormSearch>
      {modalForm}
    </PageTable>
  );
};

export default Page;
