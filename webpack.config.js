const webpack = require('webpack');
const path = require('path');

const scriptsPath = './src/';
const outputFolder = 'resources';

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  entry: {
    bg: [
      `${scriptsPath}/bg.js`,
    ],
    'options-page': [
      `${scriptsPath}/options-page.js`,
    ],
    'popup-page': [
      `${scriptsPath}/popup-page.js`,
    ],
    vendors: [
      'react',
      'react-dom',
      'classnames',
      'prop-types',
    ],
  },
  output: {
    // Absolute path to the output directory.
    path: path.resolve(__dirname, outputFolder, 'scripts'),

    // This option specifies the public URL of the output directory when
    // referenced in a browser. A relative URL is resolved relative to the HTML
    // page.
    publicPath: '/scripts/',

    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]-[local]-[hash:base64:6]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: "vendor",
          name: "vendor",
          enforce: true
        }
      }
    }
  },
  plugins: [
    // Do not emit compiled assets that include errors.
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};