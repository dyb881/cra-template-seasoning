import { FormItem, Radio, Password } from 'common/antd';
import { RouterTitle, FormModal, useInfoModal, UploadPicture } from 'components';
import { SelectAdminRole } from './role/select';
import { options } from '../config';
import { account } from 'apis';

export const useInfo = (getList: () => void, onOk: (username: string) => void) => {
  const { formModalProps, data, isEdit, ...funs } = useInfoModal({
    getList,
    defaultData: { status: 0 },
    onSubmit: async (values: any) => {
      if (isEdit) values.id = data.id;
      const res = await account.admin[isEdit ? 'edit' : 'add'](values);
      onOk(data.username);
      return res.ok;
    },
  });

  const modalForm = (
    <FormModal title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="头像" name="avatar">
        <UploadPicture />
      </FormItem>
      {isEdit ? (
        <FormItem label="用户名">{data.username}</FormItem>
      ) : (
        <FormItem label="用户名" name="username" placeholder required />
      )}
      <FormItem
        label="密码"
        name="password"
        placeholder={isEdit ? '为空则不修改密码' : true}
        required={!isEdit && '请输入密码'}
      >
        <Password />
      </FormItem>
      <FormItem label="手机号" name="phone" placeholder />
      <FormItem label="昵称" name="nickname" placeholder required />
      <FormItem label="管理角色" name="roleId" placeholder select required>
        <SelectAdminRole />
      </FormItem>
      <FormItem label="状态" name="status">
        <Radio options={options.status} />
      </FormItem>
    </FormModal>
  );

  return { modalForm, ...funs };
};
