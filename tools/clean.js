import path from 'path';
import rmdir from 'rmdir';

const binDir = path.join(__dirname, '../bin');
rmdir(binDir, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      return; // Directory already gone
    }
    console.error(err);
    process.exit(1);
  }
});
