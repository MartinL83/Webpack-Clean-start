const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
		index: './src/index.js',
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Dist output'
		})
	],
	devServer: {
		contentBase: './dist'
	},
  output: {
		filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
