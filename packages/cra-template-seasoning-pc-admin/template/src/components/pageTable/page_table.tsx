import React from 'react';
import { useHistory } from 'react-router-dom';
import { Tooltip, Divider } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { TSpinProps } from 'common/antd';
import { RouterPageHeader, TRouterPageHeaderProps, PaginationMobile, Loading, Interval, ButtonMobile } from '../layout';
import { TableMobile, TTableMobileProps } from './common';
import { ColumnsSetting, useColumnsSetting } from './columnsSetting';

export type TPageTableProps = Pick<TSpinProps, 'loading'> &
  Pick<TRouterPageHeaderProps, 'onBack' | 'extra'> &
  Omit<TTableMobileProps, 'loading'> & {
    add?: (() => void) | string; // 新建
    reload?: () => void; // 刷新
    paginationProps?: PaginationProps; // 分页数据
    paginationClose?: boolean; // 关闭分页
  };

/**
 * 表格页
 */
export const PageTable: React.FC<TPageTableProps> = ({
  loading,
  onBack,
  extra,
  add,
  reload,
  children,
  paginationProps,
  paginationClose,
  columns,
  ...props
}) => {
  const { columnsSettingProps, columnsHides } = useColumnsSetting(columns!);
  const { push } = useHistory();

  return (
    <>
      <RouterPageHeader
        onBack={onBack}
        extra={
          <div className="align-center">
            {(extra || add) && (
              <>
                <Interval>
                  {extra}
                  {add && (
                    <ButtonMobile
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={typeof add === 'string' ? () => push(add) : add}
                    >
                      新建
                    </ButtonMobile>
                  )}
                </Interval>
                <Divider type="vertical" />
              </>
            )}
            <Interval style={{ marginLeft: 0 }}>
              {reload && (
                <Tooltip placement="top" title="刷新">
                  <ReloadOutlined className="pointer" onClick={reload} />
                </Tooltip>
              )}
              <ColumnsSetting {...columnsSettingProps} />
            </Interval>
          </div>
        }
      >
        {children}
      </RouterPageHeader>
      <TableMobile key={columnsHides.length} columns={columnsHides} {...props} />
      {paginationClose || <PaginationMobile {...paginationProps} />}
      <Loading loading={loading} />
    </>
  );
};
