import { makeDir } from './lib/fs';

async function copy() {
  await makeDir('build');
}

export default copy;
