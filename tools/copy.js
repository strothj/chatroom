import { copyFile, makeDir } from './lib/fs';

async function copy() {
  await makeDir('build/public');
  await copyFile('assets/index.html', 'build/public/index.html');
}

export default copy;
