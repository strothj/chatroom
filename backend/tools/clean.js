import { cleanDir } from './lib/fs';

function clean() {
  return cleanDir('build/*', {
    nosort: true,
    dot: true,
  });
}

export default clean;
