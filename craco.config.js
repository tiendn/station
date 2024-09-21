const { whenProd } = require('@craco/craco');
const webpack = require('webpack');

module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			whenProd(() => {
				webpackConfig.module.rules.push({
				  test: /\.js$/,
				  enforce: 'pre',
				  use: ['source-map-loader'],
				  exclude: /node_modules/,
				});
			  });
		
			webpackConfig.entry = "./src/index.tsx";
			webpackConfig.resolve.fallback = {
				"crypto": require.resolve('crypto-browserify'),
				"vm": require.resolve("vm-browserify"),
				"buffer": require.resolve("buffer")
				// Add other fallbacks if needed
			};
			
			webpackConfig.ignoreWarnings = [
				(warning) =>
				  warning.message.includes('Failed to parse source map from') &&
				  warning.message.includes('ENOENT: no such file or directory'),
			  ];
		
			return webpackConfig;
		},
		plugins: {
			add: [
				new webpack.ProvidePlugin({
					Buffer: ['buffer', 'Buffer'],
				}),
				new webpack.ProvidePlugin({
					process: 'process/browser.js',
				}),
			]
		},
	},
	resolve: {
		fallback: {
		  "crypto": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
		  "buffer": require.resolve("buffer")
		} 
	},
	
	
};
