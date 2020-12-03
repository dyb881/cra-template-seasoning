import React, { useMemo } from 'react';
import { Radio as RadioSource } from 'antd';
import { RadioGroupProps } from 'antd/es/radio';
import { CheckboxOptionType } from 'antd/es/checkbox';
import { toOptions } from 'seasoning/es/data-tool';
import { TOptionsProps } from 'seasoning/es/types';

export type TRadioProps = Omit<RadioGroupProps, 'options'> & TOptionsProps<CheckboxOptionType>;

/**
 * 单选框
 */
export const Radio: React.FC<TRadioProps> = ({ options = [], ...props }) => {
  const radioGroupOptions = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return <RadioSource.Group options={radioGroupOptions} {...props} />;
};

/**
 * 单选按钮组
 */
export const RadioButton: React.FC<TRadioProps> = ({ options = [], ...props }) => {
  const radioButtons = useMemo(() => {
    return toOptions(options).map(({ value, label }, k) => (
      <RadioSource.Button key={value + k} value={value}>
        {label}
      </RadioSource.Button>
    ));
  }, [JSON.stringify(options)]);

  return <RadioSource.Group {...props}>{radioButtons}</RadioSource.Group>;
};
