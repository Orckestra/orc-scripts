const webpack = require('webpack');
const path = require('path');
const { parseEnv } = require('../utils');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
	mode: 'development',
	entry: path.resolve('./src/index.js'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(process.cwd(), 'dist'),
	},
	module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules)/,
	      use: {
	        loader: 'babel-loader',
	        options: require('./babelrc.js')
	      }
	    }
	  ]
	},
	resolve: {
		modules: [
			path.resolve('./node_modules')
		],
	},
	plugins: [
    // This makes it possible for us to safely use env vars on our code
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    })
  ]
};

if (parseEnv('NODE_ENV') === 'development') {
	module.exports.devtool = 'inline-source-map';
	module.exports.devServer = {
		contentBase: './dist',
		hotOnly: true
	};
	module.exports.plugins.push(
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	);
}
