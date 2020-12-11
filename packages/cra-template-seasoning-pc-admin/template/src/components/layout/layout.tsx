import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ConfigProvider, Layout as LayoutSource, Avatar, Tooltip, BackTop, Space } from 'antd';
import { PoweroffOutlined, MobileOutlined } from '@ant-design/icons';
import { MenuNav, Dropdown } from 'common/antd';
import { menuData } from 'common/menu';
import { defaultTitle } from 'common/router';
import { combine } from 'stores';
import { Fullscreen, MenuSwitch } from './common';
import { Setting } from './setting';
import { RouterBreadcrumb } from './router_component';
import { Preview } from './preview';
import classNames from 'classnames';
import style from './style.module.less';

/**
 * 设置为中文简体
 */
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Sider, Header, Content } = LayoutSource;

/**
 * 主体布局
 */
export const Layout: React.FC = combine(({ stores, children }) => {
  const box = useRef(null);
  const { layout, view, user } = stores;
  const { avatar, username = '未登录' } = user.info;
  const { isMobile, collapsed, collapsedChange, showHeader, showHeaderChange, setting } = layout;
  const { theme, hiddenMenu, hiddenHeader, menuIconTop, headerIconRight, componentSize } = setting;
  const isCollapsed = !(isMobile || hiddenMenu) && collapsed;
  const menuSwitchProps = { open: (isMobile || hiddenMenu) !== collapsed, onClick: collapsedChange };

  // 清空表格页数据
  const onClickItem = useCallback(() => view.setTableData('root'), []);

  const backTopPosition = isMobile ? 20 : 50;

  return (
    <ConfigProvider
      locale={zh_CN}
      componentSize={isMobile ? 'small' : componentSize}
      getPopupContainer={() => box.current || document.body}
    >
      <LayoutSource className={classNames('fill', style[componentSize])}>
        <Sider
          className={classNames(style.sider, { [style.hidden]: (isMobile || hiddenMenu) && !collapsed })}
          collapsed={isCollapsed}
          theme={theme}
        >
          <div className={`center ${style.top}`}>
            <img src={require('images/logo.svg')} alt="" className="transition" />
            {isCollapsed || <h1 className="transition">{defaultTitle}</h1>}
          </div>
          {hiddenHeader && (
            <MenuSwitch
              className={`center transition ${style.menuIcon}`}
              style={{ top: menuIconTop }}
              {...menuSwitchProps}
            />
          )}
          <MenuNav
            data={menuData}
            mode="inline"
            inlineCollapsed={isCollapsed}
            theme={theme}
            onClickItem={onClickItem}
          />
        </Sider>
        <LayoutSource>
          <Header
            className={classNames(`transition ${style.header}`, {
              [style.hidden]: hiddenHeader && !showHeader,
            })}
          >
            <div className="between-center">
              <Space>
                {(isMobile || hiddenMenu) && <img src={require('images/logo.svg')} alt="" className={style.logo} />}
                {hiddenHeader || <MenuSwitch {...menuSwitchProps} />}
              </Space>
              <Space>
                <Avatar src={avatar} size="small">
                  {username}
                </Avatar>
                <Dropdown data={[{ title: <Link to="/setUp/userCenter">个人中心</Link> }]}>
                  <span style={{ fontSize: 14 }} className="pointer">
                    {username}
                  </span>
                </Dropdown>
                <Fullscreen />
                <Setting />
                <Tooltip placement="bottom" title="注销">
                  <PoweroffOutlined className="pointer" onClick={user.logoutConfirm} />
                </Tooltip>
              </Space>
              {hiddenHeader && (
                <div
                  className={`transition ${style.showHeader}`}
                  onClick={showHeaderChange}
                  style={{ right: headerIconRight }}
                >
                  <MobileOutlined className={style.icon} />
                </div>
              )}
            </div>
          </Header>
          <Content className={style.content}>
            <div className="page" ref={box}>
              <RouterBreadcrumb />
              {children}
              {box.current && (
                <BackTop target={() => box.current!} style={{ right: backTopPosition, bottom: backTopPosition }} />
              )}
            </div>
          </Content>
        </LayoutSource>
        <Preview />
      </LayoutSource>
    </ConfigProvider>
  );
});
