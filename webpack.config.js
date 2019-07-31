const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');

const babelOptions = require('./babelrc');

module.exports = {
  mode: 'production',
  entry: path.resolve('./src/app.js'),
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new webpack.DefinePlugin({
      __DEV__: false,
      __CORS_ANYWHERE__: false, // disable for deployment
      __DEBUG__: false,
    }),
    new HtmlWebpackPlugin({
      inlineSource: '.(js)$',
      template: path.resolve('./src/index.html'),
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: babelOptions,
      }],
    }],
  },
  target: 'web',
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin(),
    ],
  },
};
