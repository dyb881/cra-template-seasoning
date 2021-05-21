import { useCallback, forwardRef, useImperativeHandle, useMemo, useEffect, useRef } from 'react';
import { Table, Space, Popover, Typography, message } from 'antd';
import { FormProps } from 'antd/es/form';
import { TableProps, ColumnsType, ColumnGroupType } from 'antd/es/table';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { useStates } from 'seasoning/es/hooks';
import { TForm, useForm, FormItem } from 'common/antd';
import { combine } from 'stores';
import { FormMobile, ButtonMobile } from '../layout';
import { VirtualTable } from './virtual_table';
import classNames from 'classnames';
import style from './style.module.less';

export type TFormSearchProps = FormProps & {
  onReset?: () => void; // 重置
  buttons?: React.ReactNode; // 追加按钮
};

/**
 * 搜索表单
 */
export const FormSearch = forwardRef<TForm, TFormSearchProps>(
  ({ children, className, onReset, buttons, ...props }, ref) => {
    const formRef = useForm();
    const { form, resetSubmit } = formRef;

    useImperativeHandle(ref, () => formRef);

    const reset = useCallback(() => {
      resetSubmit();
      onReset?.();
    }, []);

    return (
      <FormMobile
        form={form}
        layout="inline"
        name="formSearch"
        className={classNames(style.formSearch, className)}
        {...props}
      >
        {children}
        <FormItem>
          <Space>
            <ButtonMobile type="primary" icon={<SearchOutlined />} htmlType="submit">
              搜索
            </ButtonMobile>
            <ButtonMobile icon={<UndoOutlined />} onClick={reset}>
              重置
            </ButtonMobile>
            {buttons}
          </Space>
        </FormItem>
      </FormMobile>
    );
  }
);

export type TTableMobileProps = TableProps<any> & {
  widthAddition?: number; // 列宽度之和的前提上追加宽度
  boxProps?: React.HTMLProps<HTMLDivElement>;
};

/**
 * 表格
 * 默认使用 id 作为 key
 * 并自动计算高度
 */
export const TableMobile = combine<TTableMobileProps>(
  ({ stores, dataSource = [], columns = [], scroll, widthAddition = 0, boxProps, ...props }) => {
    const box = useRef<HTMLDivElement>(null);
    const { states, setStates } = useStates({ y: 0 });
    const { y, tableWidth } = states;
    const { collapsed, setting, isMobile, width, height } = stores.layout;

    useEffect(() => {
      if (!box.current) return;
      setTimeout(() => {
        const { clientHeight, firstElementChild, parentElement } = box.current!;
        const header: any = firstElementChild?.querySelector('.ant-table-header')!;
        const y = clientHeight - header?.clientHeight - 16;
        setStates({ y, tableWidth: width - (parentElement?.parentElement?.offsetLeft || 0) - 32 });
      });
    }, [setting.componentSize, collapsed, width, height]);

    // 列宽之和，用于横向滚动
    const x = useMemo(() => toScrollX(columns) + widthAddition, [columns.length, widthAddition]);

    // 移动端访问过滤浮动列
    const mergedColumns = isMobile
      ? columns.map(({ fixed, ...column }) => column)
      : columns.map((i) => {
          if (i.ellipsis && !i.render) {
            const { ellipsis, ...column } = i;
            column.render = (v) => {
              return (
                v && (
                  <Popover
                    content={<pre style={{ maxHeight: 600, overflow: 'auto' }}>{v}</pre>}
                    title={i.title}
                    placement="topLeft"
                  >
                    <Typography.Text
                      className="pointer"
                      style={{ width: '100%' }}
                      ellipsis
                      copyable={{ text: v, onCopy: () => message.success('拷贝成功') }}
                    >
                      {v}
                    </Typography.Text>
                  </Popover>
                )
              );
            };
            return column;
          }
          return i;
        });

    const tableProps: TTableMobileProps = {
      dataSource,
      rowKey: 'id',
      pagination: false,
      columns: mergedColumns,
      scroll: { x, y, ...scroll },
      ...props,
    };

    return (
      <div ref={box} className={`page-fill ${style.table}`} {...boxProps}>
        {dataSource.length > 100 ? <VirtualTable tableWidth={tableWidth} {...tableProps} /> : <Table {...tableProps} />}
      </div>
    );
  }
);

/**
 * 计算所有列之和，并追加宽度
 */
export const toScrollX = (columns: ColumnsType) => {
  return columns.reduce((v, i) => {
    let sum = (+i.width! || 0) + v;
    const { children } = i as ColumnGroupType<any>;
    if (children) sum += toScrollX(children);
    return sum;
  }, 0);
};
