import React from 'react';
import { message } from 'antd';
import { FormItem, Password, Radio } from 'common/antd';
import { PageForm, useInfo, UploadInput } from 'components';
import { combinePage } from 'stores';
import { options, renders } from '../account/config';
import { account } from 'apis';

const Page = combinePage(({ stores }) => {
  const { data, setData, setLoading, pageFormProps } = useInfo({
    getData: async () => {
      setLoading('请求数据');
      await new Promise((r) => setTimeout(r, 1));
      setData({ ...stores.user.info });
      setLoading(false);
    },
    onFinish: async (values: any) => {
      setLoading('正在保存');
      values.id = data.id;
      const res = await account.edit(values);
      setLoading(false);
      if (res.ok) {
        setData(values);
        message.success('保存成功');
        stores.user.getInfo();
      }
    },
  });

  return (
    <PageForm {...pageFormProps} onBack={false}>
      <FormItem label="头像" name="avatar">
        <UploadInput />
      </FormItem>
      <FormItem key="edit" label="用户名">
        {renders.type[data.type as keyof typeof options.type]}
        {data.username}
      </FormItem>
      <FormItem label="密码" name="password" placeholder={'为空则不修改密码'}>
        <Password />
      </FormItem>
      <FormItem label="昵称" name="nickname" placeholder required />
      <FormItem label="状态" name="status">
        <Radio options={options.status} />
      </FormItem>
    </PageForm>
  );
});

export default Page;
