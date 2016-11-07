import { copyFile, makeDir } from './lib/fs';

async function copy() {
  await makeDir('build');
  await makeDir('build/public/js');
  await copyFile('assets/index.html', 'build/public/index.html');
}

export default copy;
