import path from 'path';
import { config } from './webpack.config';

config.module.loaders[1].include.push(path.resolve(__dirname, '../test'));

export default config;
