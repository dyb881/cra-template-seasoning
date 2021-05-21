import { FC, useMemo } from 'react';
import { Select as SelectSource, TreeSelect as TreeSelectSource, Cascader as CascaderSource } from 'antd';
import { SelectProps, SelectValue } from 'antd/es/select';
import { TreeSelectProps } from 'antd/es/tree-select';
import { CascaderProps } from 'antd/es/cascader';
import { LoadingOutlined } from '@ant-design/icons';
import { toOptions } from 'seasoning/es/data-tool';
import { TOptionsProps } from 'seasoning/es/types';

export type TSelectProps = Omit<SelectProps<SelectValue>, 'options'> & TOptionsProps;

/**
 * 下拉选择框过滤器
 */
export const selectFilterOption: TSelectProps['filterOption'] = (input, option) => {
  return !!option && typeof option.children === 'string' && option.children.toLowerCase().includes(input.toLowerCase());
};

/**
 * 下拉选择框
 */
export const Select: FC<TSelectProps> = ({ options = [], ...props }) => {
  const selectOption = useMemo(() => {
    return toOptions(options).map(({ label, ...i }) => (
      <SelectSource.Option key={i.value} {...i}>
        {label}
      </SelectSource.Option>
    ));
  }, [JSON.stringify(options)]);

  return (
    <SelectSource allowClear placeholder="请选择" filterOption={selectFilterOption} {...props}>
      {selectOption}
    </SelectSource>
  );
};

export type TTreeSelectProps<T = any> = TreeSelectProps<T>;

/**
 * 树选择器
 */
export const TreeSelect: FC<TTreeSelectProps> = ({ value, ...props }) => {
  return <TreeSelectSource treeDefaultExpandAll allowClear value={value || undefined} {...props} />;
};

export type TCascaderProps = Partial<CascaderProps> & {
  loading?: boolean;
};

/**
 * 级联选择器
 */
export const Cascader: FC<TCascaderProps> = ({ loading, ...props }) => {
  return <CascaderSource expandTrigger="hover" suffixIcon={loading ? <LoadingOutlined /> : undefined} {...props} />;
};
