const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const babelOptions = require('./babelrc');

babelOptions.plugins.push('react-hot-loader/babel');

module.exports = {
  mode: 'development',
  entry: path.resolve('./src/app.js'),
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: path.resolve('./src/index.html'),
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
      __CORS_ANYWHERE__: true,
      __DEBUG__: false,
    }),
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{loader: 'react-hot-loader/webpack'}, {loader: 'babel-loader', options: babelOptions}, {loader: 'eslint-loader'}],
    }],
  },
  target: 'web',
};
