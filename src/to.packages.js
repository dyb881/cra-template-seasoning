const fs = require('fs-extra');
const { join } = require('path');
const ncu = require('npm-check-updates');

const updates = async (packagePath) => {
  return;
  console.log('包版本更新', packagePath);
  const templatePath = join(packagePath, 'template.json');
  const json = require(templatePath);
  console.log('生成缓存文件');
  const ncuPath = join(packagePath, 'ncu.template.json');
  fs.writeFileSync(ncuPath, JSON.stringify(json.package, null, 2));
  console.log('请求更新判断');
  const upgraded = await ncu.run({
    packageFile: ncuPath,
    jsonUpgraded: true,
    silent: true,
  });
  console.log('待更新版本', upgraded);
  console.log('合并版本');
  Object.assign(json.package.dependencies, upgraded);
  console.log('写入版本文件');
  fs.writeFileSync(templatePath, JSON.stringify(json, null, 2));
  console.log('删除缓存文件');
  fs.removeSync(ncuPath);
};

const packagePath = join(__dirname, '../packages/cra-template-seasoning');

// 源模版
const templateSource = join(packagePath, 'template');

const packages = {
  mobile: ['mobile'],
  'mobile-tabbar': ['mobile', 'mobile-tabbar'],
  pc: ['pc'],
  'pc-admin': ['pc', 'pc-admin'],
};

(async () => {
  await updates(packagePath);

  await updates(`${packagePath}-primitive`);

  for await (item of Object.keys(packages)) {
    const packagePathItem = `${packagePath}-${item}`;

    await updates(packagePathItem);

    console.log('模版更新', item);

    const template = join(packagePathItem, 'template');

    console.log('删除模版');
    fs.removeSync(template);

    console.log('拷贝源模版');
    fs.copySync(templateSource, template);

    packages[item].forEach((item) => {
      // 模版代码
      const src = join(__dirname, item, 'template');

      const srcDir = fs.readdirSync(join(src, 'src'));
      // 模版内带有页面
      if (srcDir.includes('pages')) {
        console.log('删除源模版页面');
        fs.removeSync(join(template, 'src/pages'));
      }

      console.log('模版覆盖', item);
      fs.copySync(src, template);
    });
  }
})();
