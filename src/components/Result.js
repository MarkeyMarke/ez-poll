import React, { useState, Fragment, useEffect } from 'react';
import { NavLink, Link, useHistory, useLocation } from 'react-router-dom';
import '../styles/Result.css';

const Result = () => {
	const history = useHistory();
	const [ question, setQuestion ] = useState('');
	const [ answers, setAnswers ] = useState([]);
	const [ errorPage, setErrorPage ] = useState(false);
	//Handling the set value for percentage
	const handleInputChange = numberVotes => {
		var index = 0;
		var total = 0;
		for (index = 0; index < answers.length; index++) {
			total = total + Number(answers[index].answerCount);
		}
		return Number((numberVotes / total * 100).toFixed(1));
	};
	//Function for getting the unique id
	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	//Calling the function
	let query = useQuery();
	//Calling the database
	const getData = async () => {
		let uniqueID = query.get('uid');
		const getUser = await fetch(`https://ez-poll.firebaseio.com/qna/${uniqueID}.json`);
		const resUserData = await getUser.json();
		if (resUserData == null) setErrorPage(true);
		else {
			setQuestion(resUserData.question);
			setAnswers(resUserData.answers);
		}
	};
	useEffect(() => {
		getData();
	}, []);
	//Handling the share button
	const sharePoll = async e => {
		e.preventDefault();
		history.push('/');
	};
	//Handling the new button
	const newPoll = async e => {
		e.preventDefault();
		history.push('/');
	};
	return errorPage != true ? (
		<div className='Result'>
			<h1 className='textLogo'>EZ Poll</h1>
			<form className='form'>
				<div>
					<input className='inputQuestion' value={question} readOnly />
					{answers.map((inputField, index) => (
						<Fragment key={index}>
							<div className=''>
								<div className='row'>
									<div className='column'>
										<label className='inputAnswerQuestion'>{inputField.answer}</label>
									</div>
									<div className='column'>
										<label className='inputAnswerVotes'>{inputField.answerCount + ' votes'}</label>
									</div>
								</div>

								<div className='row'>
									<div className='column'>
										{index.answerCount === 0 ? (
											<div
												className='w3-progress'
												style={{ width: handleInputChange(inputField.answerCount) + '%' }}
											/>
										) : (
											<div
												className='w3-progress'
												style={{ width: handleInputChange(inputField.answerCount) + '%' }}
											>
												40%
											</div>
										)}
									</div>
									<div className='column'>
										<label className='inputAnswerVotes'>
											{handleInputChange(inputField.answerCount) + '%'}
										</label>
									</div>
								</div>
							</div>
						</Fragment>
					))}
				</div>
			</form>
			<button type='submit' className='buttonPoll' onClick={sharePoll}>
				Share Poll
			</button>
			<button type='submit' className='buttonPoll' onClick={newPoll}>
				New Poll
			</button>
		</div>
	) : (
		<div className='Result'>
			<h1 className='textLogo'>Error</h1>
			<h1 className='errorText'> Path does not exist!!</h1>
		</div>
	);
};
export default Result;
