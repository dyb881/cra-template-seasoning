import { FormItem, Select, Radio, TextArea, InputNumber } from 'common/antd';
import { RouterTitle, FormModal, useInfoModal } from 'components';
import { options } from './config';
import { files } from 'apis';

export const useInfo = (getList: () => void, fileType: any) => {
  const { formModalProps, data, isEdit, ...funs } = useInfoModal({
    getList,
    defaultData: { size: 0, type: 'image', store: 'network' },
    onSubmit: async (values: any) => {
      if (isEdit) values.id = data.id;
      const res = await files[isEdit ? 'edit' : 'add'](values);
      return res.ok;
    },
  });

  const modalForm = (
    <FormModal width={500} title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="文件名" name="name" placeholder required />
      <FormItem label="文件地址" name="url" placeholder required>
        <TextArea />
      </FormItem>
      <FormItem label="文件大小" name="size" placeholder required>
        <InputNumber min={0} />
      </FormItem>
      <FormItem label="文件类型" name="type" placeholder select>
        <Select options={fileType} />
      </FormItem>
      <FormItem label="储存" name="store" placeholder select>
        <Radio options={options.store} />
      </FormItem>
    </FormModal>
  );

  return { modalForm, ...funs };
};
