import { useState, useEffect, useMemo } from 'react';
import { TreeSelect, TTreeSelectProps } from 'common/antd';
import { combine } from 'stores';
import { menu } from 'apis';

export type TSelectMenu = TTreeSelectProps & { disabledId?: string };

export const SelectMenu = combine<TSelectMenu>(({ stores, disabledId = '', ...props }) => {
  const [treeData, setTreeData] = useState<any[]>();

  useEffect(() => {
    stores.user.onLogin(async () => {
      const res = await menu.getList();
      if (!res.ok) return;
      let treeData = res.data.map(({ id, pid, title }: any) => {
        return { id, pid, value: id, label: title };
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
export const toThree = (data: any[], pid?: string): any[] => {
  const root: any[] = []; // 根数组
  const childrens: any[] = []; // 子数组

  if (pid) {
    data.forEach((i) => (pid === i.pid ? root : childrens).push(i));
  } else {
    const ids = data.map((i) => i.id);
    data.forEach((i) => (ids.includes(i.pid) ? childrens : root).push(i));
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
    if ([i.id, i.pid].includes(disabled)) i.disabled = true;
    if (i.children) i.children = treeDisabled(i.children, i.disabled ? i.id : disabled);
    return i;
  });
};
