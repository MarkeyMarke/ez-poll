import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import '../styles/Result.css';

export default class Result extends Component {
	render() {
		return (
			<div className='Result'>
				<p>Result Page</p>
				<NavLink to='/'>
					<button type='submit' className='button'>
						Share
					</button>
				</NavLink>
				<NavLink to='/'>
					<button type='submit' className='button'>
						New Poll
					</button>
				</NavLink>
			</div>
		);
	}
}
