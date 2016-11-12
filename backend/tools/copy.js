import { makeDir } from './lib/fs';

async function copy() {
  await makeDir('build/public');
}

export default copy;
