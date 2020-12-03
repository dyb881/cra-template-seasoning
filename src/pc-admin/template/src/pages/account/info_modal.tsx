import React from 'react';
import { FormItem, Radio, Password } from 'common/antd';
import { RouterTitle, FormModal, useInfoModal, UploadInput } from 'components';
import { options, renders, TTypeKeys } from './config';
import { account } from 'apis';

export const useInfo = (getList: () => void, onOk: (username: string) => void) => {
  const { formModalProps, data, isEdit, ...funs } = useInfoModal({
    getList,
    defaultData: { type: 'admin', status: 0 },
    onSubmit: async (values: any) => {
      if (isEdit) values.id = data.id;
      const res = await account[isEdit ? 'edit' : 'add'](values);
      onOk(data.username);
      return res.ok;
    },
  });

  const modalForm = (
    <FormModal title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="头像" name="avatar">
        <UploadInput />
      </FormItem>
      {isEdit ? (
        <FormItem key="edit" label="用户名">
          {renders.type[data.type as TTypeKeys]}
          {data.username}
        </FormItem>
      ) : (
        <FormItem key="add" label="用户名" name="username" placeholder required />
      )}
      <FormItem
        label="密码"
        name="password"
        placeholder={isEdit ? '为空则不修改密码' : true}
        required={!isEdit && '请输入密码'}
      >
        <Password />
      </FormItem>
      <FormItem label="昵称" name="nickname" placeholder required />
      {isEdit || (
        <FormItem label="帐号类型" name="type">
          <Radio options={options.type} />
        </FormItem>
      )}
      <FormItem label="状态" name="status">
        <Radio options={options.status} />
      </FormItem>
    </FormModal>
  );

  return { modalForm, ...funs };
};
