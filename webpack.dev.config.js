const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const babelOptions = require('./babelrc');


module.exports = {
  mode: 'development',
  entry: './src/app.js',
  externals: {
    '$': 'jquery',
    'jquery': 'jquery',
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    // }),
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: 'src/index.html',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{loader: 'babel-loader', options: babelOptions}, 'eslint-loader'],
    }, {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
          options: {
            strictMath: true,
            ieCompat: true,
          },
        },
      ],
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: ['file-loader'],
    }],
  },
  target: 'web',
};
