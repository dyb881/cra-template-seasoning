import React, { useState, useEffect, useMemo } from 'react';
import { TreeSelect, TTreeSelectProps } from 'common/antd';
import { combine } from 'stores';
import { toThree, treeDisabled } from 'utils';
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
