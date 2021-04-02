import { FC } from 'react';
import { message, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { InputList } from 'seasoning';
import { TInputNotRequired } from 'seasoning/es/types';
import { FormItem, Input, InputNumber } from 'common/antd';
import { PageForm, useInfo } from 'components';
import { files } from 'apis';
import style from './style.module.less';

const Page = () => {
  const { setData, setLoading, pageFormProps } = useInfo({
    getData: async () => {
      setLoading('请求数据');
      const res = await files.config.get();
      res.ok && setData(res.data);
      setLoading(false);
    },
    onFinish: async (values: any) => {
      setLoading('正在保存');
      const res = await files.config.save(values);
      setLoading(false);
      res.ok && message.success('保存成功');
    },
  });

  return (
    <PageForm
      {...pageFormProps}
      cols={[0, 24]}
      onBack={false}
      headerChildren="用于文件上传校验，需要重启服务后才可完全生效"
    >
      <FormItem name="filesConfig">
        <InputList
          addButton={
            <Button type="primary" icon={<PlusOutlined />} className={style.add}>
              添加文件配置
            </Button>
          }
          delButton={<DeleteOutlined className="delete" />}
        >
          <InputItem />
        </InputList>
      </FormItem>
    </PageForm>
  );
};

const InputItem: FC<TInputNotRequired> = ({ value = {}, onChange }) => {
  const change = (key: string, val: any) => {
    onChange?.({ ...value, [key]: val });
  };

  return (
    <div className={`align-center ${style.inputItem}`}>
      <div>
        <span>标识</span>
        <Input
          className={style.input}
          value={value.type}
          onChange={(e) => change('type', e.target.value)}
          style={{ width: 100 }}
        />
      </div>
      <div>
        <span>名称</span>
        <Input
          className={style.input}
          value={value.name}
          onChange={(e) => change('name', e.target.value)}
          style={{ width: 100 }}
        />
      </div>
      <div className="align-center" style={{ flex: 1 }}>
        <span>后缀</span>
        <Input
          className={style.input}
          value={value.suffixs}
          onChange={(e) => change('suffixs', e.target.value?.split(','))}
          style={{ flex: 1, minWidth: 100 }}
        />
      </div>
      <div>
        <span>大小</span>
        <InputNumber
          className={style.input}
          value={value.maxSizeMB}
          onChange={(e) => change('maxSizeMB', e)}
          min={0}
          style={{ width: 70 }}
        />
        <span>MB</span>
      </div>
    </div>
  );
};

export default Page;
