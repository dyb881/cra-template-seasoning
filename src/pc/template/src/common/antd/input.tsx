import { useMemo } from 'react';
import { Input as InputSource, InputNumber as InputNumberSource, AutoComplete as AutoCompleteSource } from 'antd';
import { InputProps, TextAreaProps, SearchProps } from 'antd/es/input';
import { InputNumberProps } from 'antd/es/input-number';
import { AutoCompleteProps } from 'antd/es/auto-complete';

/**
 * 默认文本框最大长度
 */
export const maxLength = 255;

/**
 * 文本框
 */
export const Input: React.FC<InputProps> = (props) => (
  <InputSource maxLength={maxLength} autoComplete="off" {...props} />
);

/**
 * 大文本框
 */
export const TextArea: React.FC<TextAreaProps> = (props) => (
  <InputSource.TextArea showCount maxLength={maxLength} rows={3} {...props} />
);

/**
 * 密码输入框
 */
export const Password: React.FC<InputProps> = (props) => (
  <InputSource.Password maxLength={maxLength} autoComplete="new-password" {...props} />
);

/**
 * 搜索框
 */
export const Search: React.FC<SearchProps> = (props) => <InputSource.Search maxLength={maxLength} {...props} />;

/**
 * 数字文本框
 */
export const InputNumber: React.FC<InputNumberProps> = ({
  step = 1,
  precision = ('' + step).split('.')[1]?.length || 0,
  ...props
}) => <InputNumberSource step={step} precision={precision} {...props} />;

export type TAutoCompleteProps = Omit<AutoCompleteProps, 'options'> & {
  options?: string[];
};

/**
 * 自动完成下拉框过滤器
 */
export const autoCompleteFilterOption: AutoCompleteProps['filterOption'] = (input, option) => {
  return !!option && typeof option.value === 'string' && option.value.toLowerCase().includes(input.toLowerCase());
};

/**
 * 自动完成
 */
export const AutoComplete: React.FC<TAutoCompleteProps> = ({ options = [], ...props }) => {
  const autoCompleteOptions = useMemo(() => options.map((value) => ({ value })), [JSON.stringify(options)]);

  return <AutoCompleteSource filterOption={autoCompleteFilterOption} options={autoCompleteOptions} {...props} />;
};
