import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  context: path.resolve(__dirname, '../src'),

  output: {
    path: path.resolve(__dirname, '../build/public/assets'),
    publicPath: '/assets/',
    sourcePrefix: '  ',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../src'),
        ],
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: isDebug,

          // https://babeljs.io/docs/usage/options/
          babelrc: false,
          presets: [
            // Latest stable ECMAScript features
            // https://github.com/babel/babel/tree/master/packages/babel-preset-latest
            'latest',
            // Experimental ECMAScript proposals
            // https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0
            'stage-0',
          ],
        },
        plugins: [
          'transform-runtime',
        ],
      },
    ],
  },

  resolve: {
    root: path.resolve(__dirname, '../src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.json'],
  },
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = extend(true, {}, config, {
  entry: './client.js',

  output: {
    filename: isDebug ? '[name].js?[chunkhash]' : '[name].[chunkhash].js',
    chunkFilename: isDebug ? '[name].[id].js?[chunkhash]' : '[name].[id].[chunkhash].js',
  },

  target: 'web',

  plugins: [

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: isDebug,
    }),

    // Emit a file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),

    // Assign the module and chunk ids by occurrence count
    // Consistent ordering of modules required if using any hashing ([hash] or [chunkhash])
    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    new webpack.optimize.OccurrenceOrderPlugin(true),

    ...isDebug ? [] : [
      // Search for equal or similar files and deduplicate them in the output
      // https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      new webpack.optimize.DedupePlugin(),

      // Minimize all JavaScript output of chunks
      // https://github.com/mishoo/UglifyJS2#compressor-options
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: isVerbose,
        },
      }),
    ],
  ],
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = extend(true, {}, config, {
  entry: './server.js',

  output: {
    filename: '../../server.js',
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

export default [clientConfig, serverConfig];
