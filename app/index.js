import App from "./App";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const rootEl = document.getElementById("root");

// Get base path from environment or meta tag
const basename = window.__APP_CONTEXT__ || process.env.APP_CONTEXT || "";
const basePath = basename ? `/${basename}` : "";

hydrateRoot(
	rootEl,
	<React.StrictMode>
		<BrowserRouter basename={basePath}>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
