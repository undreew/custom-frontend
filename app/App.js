import React, { Fragment } from "react";
import { Route, Routes, Link } from "react-router-dom";

import Landing from "./views/landing";
import Deposit from "./views/deposit";

const App = () => {
	return (
		<Fragment>
			<nav>
				<Link to="/">Home</Link> | <Link to="/casa-deposit">Deposit</Link>
			</nav>

			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/casa-deposit" element={<Deposit />} />
			</Routes>
		</Fragment>
	);
};

export default App;
