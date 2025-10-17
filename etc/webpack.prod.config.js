const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { DefinePlugin } = require("webpack");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
	mode: isDevelopment ? "development" : "production",

	entry: {
		main: "./app/index.js",
	},

	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
		chunkFilename: isDevelopment
			? "[name].chunk.js"
			: "[name].[contenthash].chunk.js",
		publicPath: "/",
		clean: true,
	},

	resolve: {
		extensions: [".js", ".jsx", ".json"],
		alias: {
			"@": path.resolve(__dirname, "../app"),
			"@components": path.resolve(__dirname, "../app/components"),
			"@views": path.resolve(__dirname, "../app/views"),
		},
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
						plugins: isDevelopment ? ["react-refresh/babel"] : [],
					},
				},
			},
			{
				test: /\.css$/,
				use: [
					isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: {
								auto: true,
								localIdentName: isDevelopment
									? "[name]__[local]--[hash:base64:5]"
									: "[hash:base64:8]",
							},
						},
					},
					"postcss-loader",
				],
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/i,
				type: "asset/resource",
				generator: {
					filename: "images/[name].[contenthash][ext]",
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: {
					filename: "fonts/[name].[contenthash][ext]",
				},
			},
		],
	},

	plugins: [
		new DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(
				process.env.NODE_ENV || "development"
			),
			"process.env.APP_CONTEXT": JSON.stringify(process.env.APP_CONTEXT || ""),
			__DEV__: isDevelopment,
		}),

		new HtmlWebpackPlugin({
			template: "./public/index.html",
			minify: !isDevelopment && {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),

		...(isDevelopment
			? []
			: [
					new MiniCssExtractPlugin({
						filename: "css/[name].[contenthash].css",
						chunkFilename: "css/[name].[contenthash].chunk.css",
					}),
			  ]),
	],

	optimization: {
		minimize: !isDevelopment,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true,
						drop_debugger: true,
					},
				},
			}),
			new CssMinimizerPlugin(),
		],

		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
					priority: 10,
				},
				common: {
					name: "common",
					minChunks: 2,
					chunks: "all",
					priority: 5,
					reuseExistingChunk: true,
				},
			},
		},

		runtimeChunk: {
			name: "runtime",
		},
	},

	devtool: isDevelopment ? "eval-source-map" : "source-map",

	devServer: isDevelopment
		? {
				historyApiFallback: true,
				hot: true,
				port: 3000,
				open: true,
				compress: true,
				static: {
					directory: path.join(__dirname, "../public"),
				},
		  }
		: undefined,

	performance: {
		hints: isDevelopment ? false : "warning",
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
};
