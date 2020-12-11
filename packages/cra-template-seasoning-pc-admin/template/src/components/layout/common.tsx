import React, { useState, useCallback } from 'react';
import { Modal, Tooltip, Button, Pagination, Space, Divider, ConfigProvider, Image } from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Form, Spin, TSpinProps } from 'common/antd';
import { combine } from 'stores';
import { FormProps } from 'antd/es/form';
import { ButtonProps } from 'antd/es/button';
import { PaginationProps } from 'antd/es/pagination';
import { ImageProps } from 'antd/es/Image';
import { Img as ImgSource } from 'seasoning';
import { TImgProps } from 'seasoning/es/img';
import screenfull, { Screenfull } from 'screenfull';
import classNames from 'classnames';
import style from './style.module.less';

export type TMenuSwitchProps = {
  open?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * 菜单开关按钮
 */
export const MenuSwitch: React.FC<TMenuSwitchProps> = ({ open, onClick, className, style }) => {
  return React.cloneElement(open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />, {
    onClick,
    className: classNames('pointer', className),
    style,
  });
};

export type TFullscreenProps = {
  getElement?: () => Element;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * 全屏按钮
 */
export const Fullscreen: React.FC<TFullscreenProps> = ({
  getElement = () => document.documentElement,
  className,
  style,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const s = screenfull as Screenfull;

  const onClick = useCallback(() => {
    if (!s.isEnabled) {
      Modal.error({ title: '不支持全屏', content: '该浏览器不支持全屏 API' });
      return;
    }
    if (s.isFullscreen) {
      s.exit();
    } else {
      s.request(getElement());
    }
    setIsFullscreen(!s.isFullscreen);
  }, []);

  return (
    <Tooltip placement="bottom" title="全屏">
      {React.cloneElement(isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />, {
        onClick,
        className: classNames('pointer', className),
        style,
      })}
    </Tooltip>
  );
};

/**
 * 加载中
 */
export const Loading: React.FC<TSpinProps> = ({ loading, ...props }) => {
  if (!loading) return null;

  return (
    <div className={`fill center ${style.loading}`}>
      <Spin loading={loading} {...props} />
    </div>
  );
};

/**
 * 图片组件
 */
export const Img: React.FC<TImgProps & Pick<ImageProps, 'preview'>> = ({ preview = false, onClick, ...props }) => {
  return (
    <ImgSource
      loadingTip={<LoadingOutlined />}
      errorTip={<ReloadOutlined className="pointer" />}
      onClick={preview ? undefined : onClick}
      {...props}
    >
      {({ src, style: { width, height }, mode }) => {
        if (mode?.includes('scaleToFill')) width = height = '100%';
        return <Image {...{ src, width, height, preview }} />;
      }}
    </ImgSource>
  );
};

/**
 * 自适应表单
 */
export const FormMobile = combine<FormProps>(({ stores, layout, ...props }) => (
  <Form layout={stores.layout.isMobile ? 'vertical' : layout} {...props} />
));

/**
 * 自适应按钮
 */
export const ButtonMobile = combine<ButtonProps>(({ stores, icon, children, ...props }) => {
  const { isMobile, setting } = stores.layout;

  return (isMobile || setting.componentSize === 'small') && icon ? (
    <Tooltip placement="top" title={children}>
      <Button shape="circle" icon={icon} {...props} />
    </Tooltip>
  ) : (
    <Button icon={icon} {...props}>
      {children}
    </Button>
  );
});

/**
 * 自适应分页组件
 */
export const PaginationMobile = combine<PaginationProps>(({ stores, onChange, ...props }) => {
  const { setting, isMobile } = stores.layout;
  const { componentSize } = setting;
  const size = componentSize === 'small' ? componentSize : undefined;

  return (
    <ConfigProvider componentSize="middle">
      <div className={style.pagination}>
        <Pagination
          size={size}
          simple={isMobile}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100', '200', '500', '1000']}
          showTotal={(total) => `总计 ${total} 条`}
          onChange={onChange}
          onShowSizeChange={onChange}
          {...props}
        />
      </div>
    </ConfigProvider>
  );
});

/**
 * 动作组件，自动添加分割线
 */
export const Action: React.FC = ({ children }) => <Space split={<Divider type="vertical" />}>{children}</Space>;
