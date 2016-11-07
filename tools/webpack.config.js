import path from 'path';
import extend from 'extend';
import webpack from 'webpack';

const config = {
  context: path.join(__dirname, '../src'),
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        babelrc: false,
      },
      plugins: [
        'transform-runtime',
      ],
    },
  ],
  resolve: {
    root: path.resolve(__dirname, '../src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },
};

const serverConfig = extend(true, {}, config, {
  entry: './server.js',

  output: {
    filename: 'build/server.js',
    libraryTarget: 'commonjs2',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
    }),
  ],

  externals: [
    /^\.\/assets$/,
    (context, request, callback) => {
      const isExternal =
        request.match(/^[@a-z][a-z/.\-0-9]*$/i) &&
        !request.match(/\.(css|less|scss|sss)$/i);
      callback(null, Boolean(isExternal));
    },
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
});

const clientConfig = extend(true, {}, config, {
  entry: './client.js',

  output: {
    // filename: '[name].[chunkhash].js',
    // chunkFilename: '[name].[id].[chunkhash].js',
    filename: 'build/public/js/chatroom-bundle.js',
  },

  target: 'web',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
    }),
  ],
});

// export default [clientConfig, serverConfig];
export default [clientConfig, serverConfig];
