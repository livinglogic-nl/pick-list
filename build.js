import fs from 'fs';
import child_process from 'child_process';

const passthru = (cmd) => {
  console.log(cmd);
  return child_process.execSync(cmd, { stdio:'inherit' });
}



const buildCommonjs = async() => {
  passthru('npx tsc --build tsconfig.cjs.json');

  fs.writeFileSync('dist/cjs/package.json', JSON.stringify({ type:'commonjs' }));
}
const buildModule = async() => {
  passthru('npx tsc --build tsconfig.json');
  const fixLocalImports = async() => {
    const files = child_process.execSync('find dist/mjs -type f -name "*.js"').toString().trim().split('\n');
    await Promise.all(files.map(async(f) => {
      const cnt = (await fs.promises.readFile(f)).toString();
      const fix = cnt.replaceAll(/import (.*?) from '(\..*?)'/g, (_,subject,file) =>
        `import ${subject} from '${file.replace('.js','')}.js'`)
      if(cnt !== fix) {
        await fs.promises.writeFile(f, fix);
      }
    }))
  }
  await fixLocalImports();
}

passthru('rm -rf dist');
await buildModule();
await buildCommonjs();
