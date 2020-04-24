import React, { useState, Fragment } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from 'react-alert';
import '../styles/Home.css';

export const databaseURL = `https://ez-poll.firebaseio.com/qna.json`;

const Home = props => {
	const [ question, setQuestion ] = useState('');
	const [ answers, setAnswers ] = useState([ { answer: '', answerCount: 0 } ]);
	const [ isEnabledQuestion, setIsEnabledQuestion ] = useState(false);
	const [ isEnabledPlusButton, setIsEnabledPlusButton ] = useState(false);
	const [ isEnabledTwoAnswers, setIsEnabledTwoAnswers ] = useState(false);
	const [ isEnabledAnswer, setIsEnabledAnswer ] = useState(false);
	const alert = useAlert();
	const history = useHistory();

	//Handling the set value for question
	const questionHandler = event => {
		event.preventDefault();
		if (event.target.value === '') {
			setIsEnabledQuestion(false);
			setIsEnabledPlusButton(false);
		} else {
			setIsEnabledQuestion(true);
		}
		setQuestion(event.target.value);
	};

	//Handling the set value for answer
	const handleInputChange = (index, event) => {
		event.preventDefault();
		if (event.target.value === '' && !(index >= 2)) {
			setIsEnabledAnswer(false);
			setIsEnabledPlusButton(false);
		} else {
			setIsEnabledAnswer(true);
			setIsEnabledPlusButton(true);
		}
		const values = [ ...answers ];
		values[index].answer = event.target.value;
		setAnswers(values);
	};

	//Handling the add button
	const handleAddFields = e => {
		e.preventDefault();
		const values = [ ...answers ];
		if (answers.length < 2) setIsEnabledTwoAnswers(false);
		else setIsEnabledTwoAnswers(true);
		values.push({ answer: '', answerCount: 0 });
		setIsEnabledPlusButton(false);
		setAnswers(values);
	};

	//Handling the minus button
	const handleMinusButton = (index, e) => {
		e.preventDefault();
		var newArray = new Array();
		const values = [ ...answers ];
		delete values[index];
		for (var i = 0; i < values.length; i++) {
			if (values[i] != null) {
				newArray.push(values[i]);
			}
		}
		setAnswers(newArray);
		if (newArray.length <= 2) setIsEnabledTwoAnswers(false);
		else setIsEnabledTwoAnswers(true);
	};
	//Handling the submit button
	const submitPoll = async e => {
		e.preventDefault();
		if (!isEnabledQuestion) {
			alert.show('Please fill in the question!');
			return;
		} else if (!isEnabledTwoAnswers) {
			alert.show('Please fill in at least two answers!');
			return;
		} else if (!isEnabledAnswer) {
			alert.show('Please fill in the answer!');
			return;
		}
		const values = [ ...answers ];
		values.pop();
		//Insert to Firebase
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
		if (!response.ok) {
			history.push('/error');
			return;
		}
		const resData = await response.json();
		//Outputing unique key from Firebase
		history.push(`/vote?uid=${resData.name}`);
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
									onChange={event => handleInputChange(index, event)}
									value={inputField.answer}
								/>
								{index + 1 !== answers.length ? (
									<FontAwesomeIcon
										icon={faMinusSquare}
										className='buttonPlus'
										type='button'
										onClick={event => handleMinusButton(index, event)}
									/>
								) : !isEnabledPlusButton ? (
									<FontAwesomeIcon
										icon={faPlusSquare}
										className='buttonPlus fa-disabled'
										type='button'
									/>
								) : (
									<FontAwesomeIcon
										icon={faPlusSquare}
										className='buttonPlus'
										type='button'
										onClick={handleAddFields}
									/>
								)}
							</div>
						</Fragment>
					))}
				</div>
			</form>
			<button type='submit' className='buttonPoll' onClick={submitPoll}>
				Create Poll
			</button>
		</div>
	);
};
export default Home;
