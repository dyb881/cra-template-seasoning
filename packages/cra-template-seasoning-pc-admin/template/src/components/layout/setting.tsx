import { useState, useCallback } from 'react';
import { ConfigProvider, Drawer, Switch, Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { Form, FormItem, RadioButton, InputNumber } from 'common/antd';
import { combine } from 'stores';

export const Setting = combine(({ stores }) => {
  const { setting, setSetting } = stores.layout;
  const [visible, setVisible] = useState(false);

  const onShow = useCallback(() => setVisible(true), []);
  const onClose = useCallback(() => setVisible(false), []);

  return (
    <>
      <Tooltip placement="bottom" title="网页设置">
        <SettingOutlined className="pointer" onClick={onShow} />
      </Tooltip>
      <Drawer title="网页设置" onClose={onClose} visible={visible}>
        <ConfigProvider componentSize="small">
          <Form initialValues={setting} onValuesChange={setSetting}>
            <FormItem label="组件尺寸" name="componentSize">
              <RadioButton options={componentSizeOptions} />
            </FormItem>
            <FormItem label="菜单主题色" name="theme">
              <RadioButton options={themeOptions} />
            </FormItem>
            <FormItem label="隐藏菜单" name="hiddenMenu" valuePropName="checked">
              <Switch />
            </FormItem>
            <FormItem label="隐藏页头" name="hiddenHeader" valuePropName="checked">
              <Switch />
            </FormItem>
            <FormItem label="菜单开关 Top" name="menuIconTop" placeholder>
              <InputNumber min={0} />
            </FormItem>
            <FormItem label="页头开关 Right" name="headerIconRight" placeholder>
              <InputNumber min={0} />
            </FormItem>
          </Form>
        </ConfigProvider>
      </Drawer>
    </>
  );
});

const componentSizeOptions = [
  { label: '默认' },
  { label: '大', value: 'large' },
  { label: '中', value: 'middle' },
  { label: '小', value: 'small' },
];

const themeOptions = { dark: '暗色', light: '亮色' };

/**
 * 页面配置
 */
export type TSetting = {
  componentSize: 'large' | 'middle' | 'small'; // 全局组件尺寸
  theme: 'light' | 'dark'; // 主题色
  hiddenMenu: boolean; // 隐藏菜单
  hiddenHeader: boolean; // 默认隐藏头部
  menuIconTop: number; // 菜单开关按钮位置
  headerIconRight: number; // 页头开关按钮位置
};
