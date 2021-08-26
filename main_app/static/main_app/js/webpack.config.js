const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, '.'),
		filename: 'main.js',
	},
	module: {
		rules: [
			{
				test: /\.m?jsx$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react']
					}
				}
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.js$|\.jsx$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
		]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	}
};
