import path from 'path';
import nodeExternals from 'webpack-node-externals';

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: './main.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'main.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
