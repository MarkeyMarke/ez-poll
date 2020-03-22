import React from 'react';
import { NavLink } from 'react-router-dom';

import '../styles/Vote.css';

const Vote = () => {
	return (
		<div className='Vote'>
			<p>Vote Page</p>
			<NavLink to='/results'>
				<button type='submit' className='button'>
					Submit
				</button>
			</NavLink>
			<NavLink to='/results'>
				<button type='submit' className='button'>
					Results
				</button>
			</NavLink>
		</div>
	);
};
export default Vote;
