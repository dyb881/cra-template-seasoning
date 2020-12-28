import { useMemo } from 'react';
import { Checkbox as CheckboxSource, Tag } from 'antd';
import { CheckboxGroupProps, CheckboxOptionType } from 'antd/es/checkbox';
import { CheckableTagProps } from 'antd/es/tag/CheckableTag';
import { toOptions } from 'seasoning/es/data-tool';
import { TOptionsProps, TInputNotRequired } from 'seasoning/es/types';

export type TCheckboxProps = Omit<CheckboxGroupProps, 'options'> & TOptionsProps<CheckboxOptionType>;

/**
 * 多选框
 */
export const Checkbox: React.FC<TCheckboxProps> = ({ options = [], ...props }) => {
  const checkboxOptions = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return <CheckboxSource.Group options={checkboxOptions} {...props} />;
};

export type TCheckboxTagProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'options'> &
  TOptionsProps<CheckableTagProps> &
  TInputNotRequired<any[]>;

/**
 * Tag 多选框
 */
export const CheckboxTag: React.FC<TCheckboxTagProps> = ({ options = [], value = [], onChange, ...props }) => {
  const checkboxTagOptions = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return (
    <div {...props}>
      {checkboxTagOptions.map(({ value: val, label, ...props }) => (
        <Tag.CheckableTag
          key={val}
          checked={value.includes(val)}
          onChange={(checked) => onChange?.(checked ? [...value, val] : value.filter((i: any) => i !== val))}
          {...props}
        >
          {label}
        </Tag.CheckableTag>
      ))}
    </div>
  );
};
