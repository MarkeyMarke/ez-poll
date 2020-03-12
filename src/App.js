import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Vote from './components/Vote';
import Result from './components/Result';
import Error from './components/Error';
import Navigation from './components/Navigation';

function App() {
	return (
		<BrowserRouter>
			<div>
				<Switch>
					<Route path='/' component={Home} exact />
					<Route path='/vote' component={Vote} />
					<Route path='/results' component={Result} />
					<Route component={Error} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
