import { useState, useEffect, useMemo } from 'react';
import { TreeSelect, TTreeSelectProps } from 'common/antd';
import { combine } from 'stores';
import { infos } from 'apis';

export type TSelectCategory = TTreeSelectProps & { disabledId?: string };

export const SelectCategory = combine<TSelectCategory>(({ stores, disabledId = '', ...props }) => {
  const [treeData, setTreeData] = useState<any[]>();

  useEffect(() => {
    stores.user.onLogin(async () => {
      const res = await infos.category.getList();
      if (!res.ok) return;
      let treeData = res.data.map(({ id, parentId, title }: any) => {
        return { id, parentId, value: id, label: title };
      });
      treeData = toThree(treeData);
      setTreeData(treeData);
    });
  }, []);

  const treeDisabledData = useMemo(() => {
    return disabledId ? treeDisabled(treeData || [], disabledId) : treeData;
  }, [!treeData, disabledId]);

  return <TreeSelect treeData={treeDisabledData} key={treeData?.length} loading={!treeData} {...props} />;
});

/**
 * 转换为树状数据
 */
export const toThree = (data: any[], parentId?: string): any[] => {
  const root: any[] = []; // 根数组
  const childrens: any[] = []; // 子数组

  if (parentId) {
    data.forEach((i) => (parentId === i.parentId ? root : childrens).push(i));
  } else {
    const ids = data.map((i) => i.id);
    data.forEach((i) => (ids.includes(i.parentId) ? childrens : root).push(i));
  }

  return root.map((i) => {
    const children = toThree(childrens, i.id);
    return children.length ? { ...i, children } : i;
  });
};

/**
 * 树状数据禁用
 */
export const treeDisabled = (treeData: any[], disabled: string) => {
  return treeData.map((i) => {
    if ([i.id, i.parentId].includes(disabled)) i.disabled = true;
    if (i.children) i.children = treeDisabled(i.children, i.disabled ? i.id : disabled);
    return i;
  });
};
