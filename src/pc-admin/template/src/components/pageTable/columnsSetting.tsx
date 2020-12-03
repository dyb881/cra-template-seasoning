import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox, Popover, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import { PopoverProps } from 'antd/es/popover';
import { SettingOutlined } from '@ant-design/icons';
import style from './style.module.less';

export type TColumnsSettingProps = PopoverProps & {
  columns: ColumnsType;
  value: string[];
  onChange: (hides: string[]) => void;
};

/**
 * 列展示设置
 */
export const ColumnsSetting: FC<TColumnsSettingProps> = ({ columns, value, onChange, ...props }) => {
  const { length } = value;
  const isAll = !length; // 是否全选

  const clear = useCallback(() => onChange([]), []);

  const title = useMemo(
    () => (
      <div className={style.columnsSetting}>
        <Checkbox checked={isAll} indeterminate={!isAll} onClick={clear}>
          列展示
        </Checkbox>
      </div>
    ),
    [isAll]
  );

  const content = useMemo(
    () => (
      <>
        {columns.map((i: any, k) => {
          const key = '' + (i.dataIndex || i.key || k);
          const checked = !value.includes(key);

          return (
            <div className={`between-center ${style.columnsSetting}`} key={key}>
              <Checkbox
                checked={checked}
                onClick={() => onChange(checked ? [...value, key] : value.filter((i) => i !== key))}
              >
                {i.title}
              </Checkbox>
              <span>{i.width || 'auto'}</span>
            </div>
          );
        })}
      </>
    ),
    [length]
  );

  return (
    <Tooltip placement="left" title="设置列展示">
      <Popover placement="bottomRight" title={title} content={content} trigger="click" {...props}>
        <SettingOutlined className="pointer" />
      </Popover>
    </Tooltip>
  );
};

/**
 * 列展示设置 Hooks
 */
export const useColumnsSetting = (columns: ColumnsType) => {
  const { pathname } = useLocation();
  // 读取浏览器数据
  const [value, onChange] = useState<string[]>(() => {
    if (localStorage[`columns_setting_${pathname}`]) {
      return JSON.parse(localStorage[`columns_setting_${pathname}`]);
    }
    return [];
  });

  // 记录数据到浏览器
  useEffect(() => {
    localStorage[`columns_setting_${pathname}`] = JSON.stringify(value);
  }, [value.length]);

  const columnsSettingProps = { columns, value, onChange };

  const columnsHides = columns.filter((i: any, k) => {
    const key = '' + (i.dataIndex || i.key || k);
    return !value.includes(key);
  });

  return { columnsSettingProps, columnsHides };
};
