// ...existing code...
const path = require("path");
const webpack = require("webpack");
const WebpackBar = require("webpackbar");

// dev-only webpack config exported as a function for compatibility with existing requires
module.exports = () => {
	const entry = path.resolve(__dirname, "../app/index.js");
	const isDev = true; // dev-only config

	return {
		mode: "development",
		// faster, dev-friendly source maps
		devtool: "eval-source-map",
		// persistent cache -> big win for repeated rebuilds
		cache: {
			type: "filesystem",
			buildDependencies: {
				config: [__filename],
			},
		},
		entry: [
			"webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=20000",
			entry,
		],
		output: {
			path: path.resolve(__dirname, "../dist"),
			// allow multiple named chunks (entry + runtime + vendors) without filename conflicts
			filename: "[name].js",
			publicPath: "/",
			chunkFilename: "[name].js",
		},
		resolve: { extensions: [".js", ".jsx"] },
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							cacheDirectory: true, // babel cache
							presets: [
								["@babel/preset-env", { targets: { node: "current" } }],
								["@babel/preset-react", { runtime: "automatic" }],
							],
						},
					},
				},
				{ test: /\.css$/, use: ["style-loader", "css-loader"] },
			],
		},
		plugins: [
			new WebpackBar({ color: "green" }),
			new webpack.HotModuleReplacementPlugin(),
		],
		optimization: {
			usedExports: true, // mark exports for tree-shaking
			sideEffects: true, // let webpack respect package.json sideEffects
			runtimeChunk: "single", // separate runtime
			splitChunks: {
				chunks: "all",
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendor",
						chunks: "all",
					},
				},
			},
			minimize: !isDev,
		},
	};
};
