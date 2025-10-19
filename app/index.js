import App from "./App";
import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const rootEl = document.getElementById("root");

// Get base path from environment or meta tag
const basename = window.__APP_CONTEXT__ || process.env.APP_CONTEXT || "";
const basePath = basename ? `/${basename}` : "";

const app = (
	<React.StrictMode>
		<BrowserRouter basename={basePath}>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

// Use hydrateRoot for SSR, createRoot for static builds
if (rootEl.hasChildNodes()) {
	// Has server-rendered content - hydrate
	hydrateRoot(rootEl, app);
} else {
	// No server-rendered content - create new root
	createRoot(rootEl).render(app);
}
