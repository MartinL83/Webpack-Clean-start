const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: {
		main: './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
	},
	module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['@babel/preset-env']
	        }
	      }
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
						use: [{
								loader: "css-loader"
						}, {
								loader: "sass-loader",
								options: {
									includePaths: [ path.resolve(__dirname, 'src/sass') ]
								}
						}],
						// use style-loader in development
						fallback: "style-loader"
				})
			}
	  ]
	},
	plugins: [
		extractSass,
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Webpack HTML Output'
		})
	],
	devServer: {
		contentBase: './dist'
	},
};
