import React, { useMemo } from 'react';
import { Select as SelectSource, TreeSelect as TreeSelectSource } from 'antd';
import { SelectProps, SelectValue } from 'antd/es/select';
import { TreeSelectProps } from 'antd/es/tree-select';
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
export const Select: React.FC<TSelectProps> = ({ options = [], ...props }) => {
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
export const TreeSelect: React.FC<TTreeSelectProps> = ({ value, ...props }) => {
  return <TreeSelectSource treeDefaultExpandAll allowClear value={value || undefined} {...props} />;
};
