const path = require('path');

module.exports = {
	mode: 'development',
	entry: path.resolve('./src/index.js'),
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, '../../dist')
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
	}
};
