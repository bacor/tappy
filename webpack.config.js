const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },

  module: {
    rules: [{
      test: /\.jsx/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: { presets: ['react', 'env'] },
        },
        'eslint-loader',
      ],
    },
    {
      test: /\.scss/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }],
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
