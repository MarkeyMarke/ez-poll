import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import '../styles/Home.css';

export default class Home extends Component {
	render() {
		return (
			<div className='Home'>
				<p>Home Page</p>
				<NavLink to='/vote'>
					<button type='submit' className='button'>
						Create Poll
					</button>
				</NavLink>
			</div>
		);
	}
}
