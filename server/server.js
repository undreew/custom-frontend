// ...existing code...
const path = require("path");
const fs = require("fs");
const express = require("express");
const { StaticRouter } = require("react-router-dom/server");

// enable on-the-fly transpile for server-side requires of JSX during dev
require("@babel/register")({
	presets: [
		["@babel/preset-env", { targets: { node: "current" } }],
		["@babel/preset-react", { runtime: "automatic" }],
	],
	extensions: [".js", ".jsx"],
	ignore: [/node_modules/],
});

const webpack = require("webpack");
const webpackConfigFactory = require(path.resolve(
	__dirname,
	"../etc/webpack.config.js"
));
const webpackConfig = webpackConfigFactory();
const compiler = webpack(webpackConfig);

const webpackDevMiddleware = require("webpack-dev-middleware")(compiler, {
	publicPath: webpackConfig.output.publicPath,
	serverSideRender: false,
	stats: "minimal",
});

const webpackHotMiddleware = require("webpack-hot-middleware")(compiler, {
	path: "/__webpack_hmr",
});

const React = require("react");
const { renderToString } = require("react-dom/server");
const App = require(path.resolve(__dirname, "../app/App")).default;

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.resolve(__dirname, "../public");

// attach webpack middleware (serves bundle from memory)
app.use(webpackDevMiddleware);
app.use(webpackHotMiddleware);

// serve static assets from public (index.html template, etc.)
app.use(express.static(PUBLIC, { index: false }));

// SSR route: render and inject into public/index.html
app.use((req, res) => {
	const indexFile = path.resolve(PUBLIC, "index.html");
	fs.readFile(indexFile, "utf8", (err, htmlData) => {
		if (err) {
			console.error("Error reading index.html", err);
			return res.status(500).send("Internal server error");
		}

		const context = {};

		const appHtml = renderToString(
			React.createElement(
				StaticRouter,
				{ location: req.url, context },
				React.createElement(App) // App should now be router-agnostic
			)
		);

		// inject into index template:
		const rendered = htmlData.replace(
			'<div id="root"></div>',
			`<div id="root">${appHtml}</div>`
		);

		res.send(rendered);
	});
});

app.listen(PORT, () => {
	console.log(`Dev SSR server listening at http://localhost:${PORT}`);
});
// ...existing code...
