import { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { TInputNotRequired } from 'seasoning/es/types';
import { FormItem } from 'common/antd';
import { RouterTitle, FormModal, useInfoModal } from 'components';
import { combine } from 'stores';
import { account } from 'apis';
import { cloneDeep, set, get } from 'lodash';

export const useInfo = (getList: () => void) => {
  const { formModalProps, data, isEdit, ...funs } = useInfoModal({
    getList,
    onSubmit: async (values: any) => {
      if (isEdit) values.id = data.id;
      const res = await account.admin.role[isEdit ? 'edit' : 'add'](values);
      return res.ok;
    },
  });

  const modalForm = (
    <FormModal title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="角色名称" name="name" placeholder required />
      <FormItem label="角色权限" name="permissions">
        <Permissions />
      </FormItem>
    </FormModal>
  );

  return { modalForm, ...funs };
};

const Permissions = combine<TInputNotRequired<any>>(({ stores, value, onChange }) => {
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    stores.user.onLogin(async () => {
      const res = await account.admin.role.getConfig();
      res.ok && setData(res.data);
    });
  }, []);

  if (!data) return <div>加载中</div>;

  const checkedKeys: string[] = [];

  const getTreeData = (permissions: any, k = ''): any[] => {
    return Object.keys(permissions).map((i) => {
      const key = k ? `${k}.${i}` : i;
      const title = titles[key] || actions[key.split('.').pop()!];
      const item: any = { key, title };
      if (typeof permissions[i] !== 'boolean') {
        item.children = getTreeData(permissions[i], key);
      }
      get(value, key) === true && checkedKeys.push(key);
      return item;
    });
  };

  const treeData = getTreeData(data);

  return (
    <Tree
      checkable
      treeData={treeData}
      checkedKeys={checkedKeys}
      defaultExpandedKeys={treeData.map((i) => i.key)}
      height={500}
      onCheck={(checked) => {
        if (Array.isArray(checked)) {
          const newData = cloneDeep(data!);
          checked.forEach((i: any) => {
            titleKeys.includes(i) || set(newData, i, true);
          });
          onChange?.(newData);
        }
      }}
    />
  );
});

const titles: any = {
  account: '账号管理',
  'account.account': '基础账号',
  'account.roleAdmin': '管理员角色',
  'account.admin': '管理员账号',
  'account.user': '用户账号',
  files: '文件管理',
  'files.files': '文件信息',
  'files.config': '文件配置',
  infos: '信息管理',
  'infos.category': '分类管理',
  'infos.information': '信息列表',
};

export const titleKeys = Object.keys(titles);

const actions: any = { query: '查询', create: '新建', update: '编辑', delete: '删除' };
