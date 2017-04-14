import path from 'path';
import webpack from 'webpack';

const outPath = path.join(__dirname, 'pages');

const pluginsWithoutUglify = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }),
  new webpack.optimize.CommonsChunkPlugin(
    path.join('js', 'bundle-commons.js'), ['app', 'advanced']),
];

const plugins = pluginsWithoutUglify.concat([
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
    mangle: true,
  }),
]);

const babelLoaderConfigShared = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  query: {
    ...require('./package.json').babel,
    cacheDirectory: true,
  },
};

export default {
  entry: {
    app: [
      './src/index.js',
    ],
    advanced: [
      './src/examples/AdvancedExample/index.js',
    ],
  },
  output: {
    path: outPath,
    filename: path.join('js', 'bundle-[name].js'),
  },
  module: {
    loaders: [
      {
        loader: 'json-loader',
        test: /\.json$/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        exclude: /node_modules/,
        ...babelLoaderConfigShared,
      },
      {
        include: /react-three-renderer[\\\/]src/,
        ...babelLoaderConfigShared,
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      // use the source files
      'react-three-renderer': path.join(
        __dirname, 'node_modules', 'react-three-renderer', 'src'),
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'assets'),
    // noInfo: true, //  --no-info option
    hot: true,
    inline: true,
    stats: { colors: true },
  },
  pluginsWithoutUglify,
  plugins,
};
