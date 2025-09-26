import App from "./App";
import React from "react";
import { hydrateRoot } from "react-dom/client";

const rootEl = document.getElementById("root");

hydrateRoot(
	rootEl,
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

if (module && module.hot) {
	module.hot.accept();
}
