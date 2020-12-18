import React from 'react';
import { FormItem, Radio, TextArea, InputNumber } from 'common/antd';
import { RouterTitle, FormModal, useInfoModal, UploadInput } from 'components';
import { options } from './config';
import { SelectMenu } from './select';
import { menu } from 'apis';

export const useInfo = (getList: () => void) => {
  const { formModalProps, data, isEdit, visible, ...funs } = useInfoModal({
    getList,
    defaultData: { priority: 0, status: 1 },
    onSubmit: async (values: any) => {
      if (isEdit) values.id = data.id;
      const res = await menu[isEdit ? 'edit' : 'add'](values);
      return res.ok;
    },
  });

  const modalForm = (
    <FormModal title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="所属菜单" name="pid" placeholder="不选则作为根菜单">
        <SelectMenu disabledId={data.id} />
      </FormItem>
      <FormItem label="标题" name="title" placeholder required />
      <FormItem label="内容" name="content" placeholder>
        <TextArea />
      </FormItem>
      <FormItem label="图标" name="icon">
        <UploadInput />
      </FormItem>
      <FormItem label="优先级" name="priority" required>
        <InputNumber />
      </FormItem>
      <FormItem label="状态" name="status">
        <Radio options={options.status} />
      </FormItem>
    </FormModal>
  );

  return { modalForm, ...funs };
};
