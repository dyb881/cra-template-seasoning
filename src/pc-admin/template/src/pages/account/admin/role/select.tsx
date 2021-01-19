import { useState, useEffect } from 'react';
import { Select, TSelectProps } from 'common/antd';
import { combine } from 'stores';
import { account } from 'apis';

export const SelectAdminRole = combine<TSelectProps>(({ stores, ...props }) => {
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    stores.user.onLogin(async () => {
      const res = await account.admin.role.getList();
      res.ok && setData(res.data.map((i: any) => ({ label: i.name, value: i.id })));
    });
  }, []);

  return <Select options={data} {...props} />;
});
