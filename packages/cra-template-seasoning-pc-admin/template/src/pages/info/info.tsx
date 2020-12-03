import React from 'react';
import { message } from 'antd';
import { FormItem, Radio, InputNumber, TextArea } from 'common/antd';
import { PageForm, useInfo, UploadInput, SelectMenu } from 'components';
import { combinePage } from 'stores';
import { options } from './config';
import { info } from 'apis';

type TParams = { id?: string };

const Page = combinePage<TParams>(({ history, match }) => {
  const { id } = match.params;
  const { setData, setLoading, pageFormProps } = useInfo({
    defaultData: { hot: 0, priority: 0, status: 1 },
    getData: async () => {
      if (!id) return;
      setLoading('请求数据');
      const res = await info.details(id);
      res.ok && setData(res.data);
      setLoading(false);
    },
    onFinish: async (values: any) => {
      setLoading('正在保存');
      if (id) values.id = id; // 编辑时需要带入 ID
      const res = await info[id ? 'edit' : 'add'](values);
      if (!res.ok) return setLoading(false);
      message.success(`${id ? '保存' : '新建'}成功`);
      history.goBack();
    },
  });

  return (
    <PageForm {...pageFormProps}>
      <FormItem label="所属菜单" name="menu_id" placeholder select required>
        <SelectMenu />
      </FormItem>
      <FormItem label="标题" name="title" placeholder required />
      <FormItem label="简介" name="summary" placeholder>
        <TextArea />
      </FormItem>
      <FormItem label="内容" name="content" placeholder>
        <TextArea />
      </FormItem>
      <FormItem label="图标" name="icon">
        <UploadInput />
      </FormItem>
      <FormItem label="图组" name="picture_group">
        <UploadInput multiple max={20} />
      </FormItem>
      <FormItem label="热度" name="hot" required>
        <InputNumber />
      </FormItem>
      <FormItem label="优先级" name="priority" required>
        <InputNumber />
      </FormItem>
      <FormItem label="状态" name="status">
        <Radio options={options.status} />
      </FormItem>
    </PageForm>
  );
});

export default Page;
