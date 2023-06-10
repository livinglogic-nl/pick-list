import child_process from 'child_process';
import fs from 'fs';

const demoModuleDir = 'demo/mjs/';
const demoCommonjsDir = 'demo/cjs/';

const convertDemoFile = (module) => {
  let cnt = fs.readFileSync(demoModuleDir + module).toString();
  cnt = cnt.replace(
    /^import (.+) from (.+?);/gm,
    (_,what,from) =>
      `const ${what} = await import(${from.replace('/mjs/', '/cjs/')})`
  );

  cnt = 
    `(async() => {
${cnt.split('\n').map(s => '  '+s).join('\n')}
})()`;

  fs.writeFileSync(demoCommonjsDir + module, cnt);
}

child_process.execSync(`rm -rf ${demoCommonjsDir}`);
fs.mkdirSync(demoCommonjsDir);
fs.writeFileSync(demoCommonjsDir + 'package.json', JSON.stringify({
  type: 'commonjs',
}));

const demoFiles = fs.readdirSync(demoModuleDir).filter(f => f !== 'package.json')
demoFiles
.forEach(convertDemoFile);
