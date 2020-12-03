import React, { FC, useMemo } from 'react';
import { Radio as RadioSource } from 'antd';
import { RadioGroupProps } from 'antd/es/radio';
import { CheckboxOptionType } from 'antd/es/checkbox';
import { toOptions } from 'seasoning/es/data-tool';
import { TOptionsProps } from 'seasoning/es/types';

export type TRadioProps = Omit<RadioGroupProps, 'options'> & TOptionsProps<CheckboxOptionType>;

/**
 * 单选框
 */
export const Radio: FC<TRadioProps> = ({ options = [], ...props }) => {
  const radioGroupOptions = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return <RadioSource.Group options={radioGroupOptions} {...props} />;
};

/**
 * 单选按钮组
 */
export const RadioButton: FC<TRadioProps> = (props) => {
  return <Radio optionType="button" buttonStyle="solid" {...props} />;
};
