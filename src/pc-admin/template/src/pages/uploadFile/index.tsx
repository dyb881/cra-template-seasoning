import React, { useState, useMemo, useCallback } from 'react';
import { Drawer } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FormItem, Select } from 'common/antd';
import { useTable, PageTable, FormSearch, ButtonMobile, UploadDragger } from 'components';
import { options, createColumns } from './config';
import { uploadFile } from 'apis';

const Page = () => {
  const [visible, setVisible] = useState(false);
  const { setData, pageTableProps, formSearchProps, getList, del, DelButton } = useTable({
    onList: async ({ current, pageSize, search }) => {
      const res = await uploadFile.getList({ current, pageSize, ...search });
      res.ok && setData(res.data.list, res.data.total);
    },
    onDel: async (ids) => {
      const res = await uploadFile.del(ids);
      return res.ok;
    },
  });

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ del }), []);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => {
    setVisible(false);
    getList();
  }, []);

  return (
    <PageTable
      {...pageTableProps}
      columns={columns}
      extra={
        <>
          <DelButton />
          <ButtonMobile type="primary" icon={<UploadOutlined />} onClick={show}>
            上传文件
          </ButtonMobile>
        </>
      }
    >
      <FormSearch {...formSearchProps}>
        <FormItem label="上传帐号" name="username" placeholder />
        <FormItem label="文件名" name="name" placeholder />
        <FormItem label="文件类型" name="type" placeholder select>
          <Select options={options.type} />
        </FormItem>
      </FormSearch>
      <Drawer
        title="文件上传"
        placement="right"
        width={500}
        mask={false}
        visible={visible}
        onClose={hide}
        destroyOnClose
      >
        <UploadDragger />
      </Drawer>
    </PageTable>
  );
};

export default Page;
