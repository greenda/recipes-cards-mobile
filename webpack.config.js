const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
         test: /\.(js|jsx|tsx|ts)$/,
         exclude: /node_modules/,
         loader: 'babel-loader'
        },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {}
      },
    ],
  },
  resolve: {
		extensions: [".ts", ".js"]
	},
  output: {
    path: path.join(__dirname, "build"),
    filename: "index.js",
  },
  plugins: [new HtmlWebpackPlugin({
    template: './index.html',
    filename: 'index.html',
    inject: 'body'
  })],
  target: 'web',
  node: {
    __dirname: false,
  },
};
