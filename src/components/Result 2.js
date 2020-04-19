import React from 'react';
import { NavLink } from 'react-router-dom';

import '../styles/Result.css';

const Result = () => {
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
};
export default Result;
