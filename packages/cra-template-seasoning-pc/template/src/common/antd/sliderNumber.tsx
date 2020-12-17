import { FC } from 'react';
import { Slider, Row, Col } from 'antd';
import { InputNumber } from './input';
import { SliderSingleProps, SliderRangeProps } from 'antd/es/slider';
import { InputNumberProps } from 'antd/es/input-number';

export type TSliderSingleProps = SliderSingleProps & {
  inputNumberProps?: InputNumberProps;
};

export type TSliderRangeProps = SliderRangeProps & {
  inputNumberProps?: InputNumberProps;
};

export const SliderNumber: FC<TSliderSingleProps | TSliderRangeProps> = ({ className, inputNumberProps, ...props }) => {
  const { range, value = range ? [0, 0] : 0, onChange, min = 0, max, step } = props;
  const numberProps = { min, max, step: step || 1, ...inputNumberProps };

  return (
    <Row wrap={false} gutter={5}>
      {Array.isArray(value) ? (
        <>
          <Col>
            <InputNumber
              {...numberProps}
              value={value[0]}
              onChange={(val) => onChange?.([val || 0, value[1]] as any)}
            />
          </Col>
          <Col>
            <InputNumber
              {...numberProps}
              value={value[1]}
              onChange={(val) => onChange?.([value[0], val || 0] as any)}
            />
          </Col>
        </>
      ) : (
        <Col>
          <InputNumber {...numberProps} value={value} onChange={(val: any) => onChange?.(val || 0)} />
        </Col>
      )}
      <Col flex="auto">
        <Slider {...props} />
      </Col>
    </Row>
  );
};
