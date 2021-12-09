const Path = require('path');
const Html = require('html-webpack-plugin');

module.exports = [{
	entry: './source/main.coffee',
	mode: 'production',
	optimization: {minimize: true},
	target: 'web',
	devtool: 'inline-source-map',
	output: {
		library: 'CP',
		libraryTarget: 'umd',
		path: Path.resolve(__dirname, 'build'),
		filename: 'cart-pendulum.js',
	},
	resolve: {
		extensions: ['.js', '.coffee']
	},
	module: {
		rules: [
			{
				test: /\.coffee$/,
				loader: 'coffee-loader',
			},
		],
	},
}];