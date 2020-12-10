const fs = require('fs-extra');
const { join } = require('path');

const source = join(__dirname, './packages/cra-template-seasoning');

// 源模版
const templateSource = join(source, 'template');

const packages = {
  mobile: ['mobile'],
  'mobile-tabbar': ['mobile', 'mobile-tabbar'],
  pc: ['pc'],
  'pc-admin': ['pc', 'pc-admin'],
};

Object.keys(packages).forEach((item, index) => {
  // 目标模版
  const template = join(`${source}-${item}`, 'template');

  // 删除源模版
  fs.removeSync(template);

  // 拷贝源模版
  fs.copySync(templateSource, template);

  packages[item].forEach((item) => {
    // 模版代码
    const src = join(__dirname, 'src', item, 'template');

    const srcDir = fs.readdirSync(join(src, 'src'));
    // 模版内带有页面
    if (srcDir.includes('pages')) {
      fs.removeSync(join(template, 'src/pages'));
    }

    // 拷贝特定源码到模版
    fs.copySync(src, template);
  });
});
