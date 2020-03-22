import React, { useState, Fragment } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';

import '../styles/Home.css';

export const databaseURL = `https://ez-poll.firebaseio.com/qna.json`;

const Home = props => {
	const [ question, setQuestion ] = useState('');
	const [ answers, setAnswers ] = useState([ { answer: null, answerID: null, answerCount: 0 } ]);
	const [ isEnabledQuestion, setIsEnabledQuestion ] = useState(false);
	const [ isEnabledAnswer, setIsEnabledAnswer ] = useState(false);
	const [ isEnabledTwoAnswers, setIsEnabledTwoAnswers ] = useState(false);
	const history = useHistory();
	//Handling the set value for question
	const questionHandler = event => {
		if (event.target.value === '') setIsEnabledQuestion(false);
		else {
			setIsEnabledQuestion(true);
			setQuestion(event.target.value);
		}
	};
	//Handling the set value for answer
	const handleInputChange = (index, event) => {
		if (event.target.value === '') setIsEnabledAnswer(false);
		else {
			setIsEnabledAnswer(true);
			const values = [ ...answers ];
			values[index].answerID = index;
			values[index].answer = event.target.value;
			setAnswers(values);
		}
	};
	//Handling the add button
	const handleAddFields = e => {
		e.preventDefault();
		const values = [ ...answers ];
		if (values.length < 2) setIsEnabledTwoAnswers(false);
		else setIsEnabledTwoAnswers(true);
		values.push({ answer: '', answerID: null, answerCount: 0 });
		setAnswers(values);
	};
	//Handling the submit button
	const submitPoll = async e => {
		e.preventDefault();
		const values = [ ...answers ];
		values.pop();
		//Outputing question and answers, Delete later
		console.log(question, values);
		const response = await fetch(databaseURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: question,
				answers: values
			})
		});
		const resData = await response.json();
		//Outputing unique key from Firebase
		console.log(resData);
		//history.push('/vote');
	};
	return (
		<div className='Home'>
			<h1 className='textLogo'>EZ Poll</h1>
			<form className='form' onSubmit={submitPoll}>
				<div>
					<input
						className='inputQuestion'
						type='text'
						placeholder='Type your question here.'
						name='question'
						onChange={questionHandler}
						value={question}
					/>
					{answers.map((inputField, index) => (
						<Fragment key={`${inputField}${index}`}>
							<div className=''>
								<input
									type='text'
									className='inputAnswer1'
									placeholder='Enter poll option.'
									id='answer1'
									name='answer1'
									onChange={event => handleInputChange(index, event)}
									value={inputField.answer1}
								/>
								{index + 1 !== answers.length ? (
									<button className='buttonPlusHidden' type='button' onClick={handleAddFields}>
										+
									</button>
								) : (
									<button className='buttonPlus' type='button' onClick={handleAddFields}>
										+
									</button>
								)}
							</div>
						</Fragment>
					))}
				</div>
			</form>
			<button
				type='submit'
				className='buttonPoll'
				disabled={!isEnabledQuestion || !isEnabledAnswer || !isEnabledTwoAnswers}
				onClick={submitPoll}
			>
				Create Poll
			</button>
		</div>
	);
};
export default Home;
