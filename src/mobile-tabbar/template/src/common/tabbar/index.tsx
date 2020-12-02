import { useEffect } from 'react';
import { Tabs } from 'seasoning';
import { combine } from 'stores';
import classnames from 'classnames';
import style from './style.module.less';

export type TTab = {
  pagePath: string; // 页面路径，基于 src/pages 目录
  title: string; // 页面标题
};

type TTabsProps = {
  tabs: TTab[];
  listen?: (tab: TTab) => void;
};

/**
 * TabBar
 */
export const TabBar = combine<TTabsProps>(({ stores, tabs, listen }) => {
  const { activeKey, setActiveKey } = stores.view;

  useEffect(() => {
    setTimeout(() => {
      listen?.(tabs[activeKey]);
    });
  }, [activeKey]);

  return (
    <Tabs
      tabs={tabs}
      activeKey={activeKey}
      onChange={setActiveKey}
      className={`fill ${style.tabbar}`}
      direction="bottom"
      transition
      render={({ pagePath }) => {
        const C = require('../../pages' + pagePath).default;
        return <C />;
      }}
      itemRender={(active, { title }) => {
        return (
          <div
            className={classnames('column-center', style.item, {
              [style.active]: active,
            })}
          >
            {title}
          </div>
        );
      }}
    />
  );
});

/**
 * 函数生成 tabbar 页面组件
 */
export const tabbar = (props: TTabsProps) => {
  return () => <TabBar {...props} />;
};
