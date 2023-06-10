import fs from 'fs';

const demoModuleDir = 'demo/mjs/';

const convertDemoFile = (module) =>
  fs.readFileSync(demoModuleDir + module).toString()
  .replace('../../dist/mjs/index.js', 'pick-list')
  .replace(/import { autoType }.+\n/, '')
  .replace(/autoType([\s\S]+?);/m,'')
  .replace(/\n\n/g, '\n')

const demoFiles = fs.readdirSync(demoModuleDir).filter(f => f !== 'package.json')

const demos = demoFiles.map(file => {
  const cnt = convertDemoFile(file);
  const name = file.substring(3).replace(/-/g,' ').replace('.js','');
  return [
    '### '+ name,
    '```ts',
    cnt,
    '```',
  ].join('\n');
});

const readme = fs.readFileSync('utils/README-template.md')
  .toString()
  .replace('{{demos}}', demos.join('\n\n'));

fs.writeFileSync('README.md', readme);

