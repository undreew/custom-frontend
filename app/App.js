import React from "react";
import { Route, Routes } from "react-router-dom";

import Landing from "./views/landing";
import Deposit from "./views/deposit";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/casa-deposit" element={<Deposit />} />
		</Routes>
	);
};

export default App;
