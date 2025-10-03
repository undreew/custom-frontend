import App from "./App";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const rootEl = document.getElementById("root");

hydrateRoot(
	rootEl,
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

if (module && module.hot) {
	module.hot.accept();
}
