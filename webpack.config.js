const webpack = require('webpack');
const path = require('path');

const outputFolder = 'resources';

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  entry: {
    bg: [
      './src/Bg.js',
    ],
    'options-page': [
      './src/views/OptionsPage/index.js',
    ],
    'popup-page': [
      './src/views/PopupPage/index.js',
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
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Do not emit compiled assets that include errors.
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};