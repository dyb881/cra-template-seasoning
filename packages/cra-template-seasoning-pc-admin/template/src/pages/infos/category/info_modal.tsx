import { FormItem, Radio, InputNumber } from 'common/antd';
import { FormModal, RouterTitle, UploadPicture, useInfoModal } from 'components';
import { options } from './config';
import { SelectCategory } from '../category/select';
import { infos } from 'apis';

export const useInfo = (getList: () => void) => {
  const { formModalProps, data, isEdit, ...funs } = useInfoModal({
    getList,
    defaultData: { priority: 0, status: 1 },
    onSubmit: async (values: any) => {
      if (isEdit) values.id = data.id;
      const res = await infos.category[isEdit ? 'edit' : 'add'](values);
      return res.ok;
    },
  });

  const modalForm = (
    <FormModal title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="所属分类" name="parentId" placeholder select>
        <SelectCategory disabledId={data.id} />
      </FormItem>
      <FormItem label="标题" name="title" placeholder required />
      <FormItem label="图标" name="icon">
        <UploadPicture />
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
