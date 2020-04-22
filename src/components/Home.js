import React, { useState, Fragment } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import "../styles/Home.css";

export const databaseURL = `https://ez-poll.firebaseio.com/qna.json`;

const Home = (props) => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{ answer: null, answerCount: 0 }]);
  const [isEnabledQuestion, setIsEnabledQuestion] = useState(false);
  const [isEnabledAnswer, setIsEnabledAnswer] = useState(false);
  const [isEnabledPlusButton, setIsEnabledPlusButton] = useState(false);
  const [isEnabledTwoAnswers, setIsEnabledTwoAnswers] = useState(false);
  const alert = useAlert();
  const history = useHistory();

  //Handling the set value for question
  const questionHandler = (event) => {
    if (event.target.value === "") {
      setIsEnabledQuestion(false);
      setIsEnabledPlusButton(false);
    } else {
      setIsEnabledQuestion(true);
    }
    setQuestion(event.target.value);
  };

  //Handling the set value for answer
  const handleInputChange = (index, event) => {
    if (event.target.value === "") {
      setIsEnabledAnswer(false);
      setIsEnabledPlusButton(false);
    } else {
      setIsEnabledAnswer(true);
      setIsEnabledPlusButton(true);
      const values = [...answers];
      values[index].answer = event.target.value;
      setAnswers(values);
    }
  };

  //Handling the add button
  const handleAddFields = (e) => {
    e.preventDefault();
    const values = [...answers];
    if (values.length < 2) setIsEnabledTwoAnswers(false);
    else setIsEnabledTwoAnswers(true);
    values.push({ answer: "", answerCount: 0 });
    setIsEnabledPlusButton(false);
    setAnswers(values);
  };

  //Handling the submit button
  const submitPoll = async (e) => {
    e.preventDefault();
    if (!isEnabledQuestion) {
      alert.show("Please fill in the question!");
      return;
    } else if (!isEnabledAnswer) {
      alert.show("Please fill in your answers!");
      return;
    } else if (!isEnabledTwoAnswers) {
      alert.show("Please fill in at least two answers!");
      return;
    }
    const values = [...answers];
    values.pop();

    //Insert to Firebase
    const response = await fetch(databaseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        answers: values,
      }),
    });
    if (!response.ok) {
      history.push("/error");
      return;
    }

    const resData = await response.json();
    //Outputing unique key from Firebase
    history.push(`/vote?uid=${resData.name}`);
  };
  return (
    <div className="Home">
      <h1 className="textLogo">EZ Poll</h1>
      <form className="form" onSubmit={submitPoll}>
        <div>
          <input
            className="inputQuestion"
            type="text"
            placeholder="Type your question here."
            name="question"
            onChange={questionHandler}
            value={question}
          />
          {answers.map((inputField, index) => (
            <Fragment key={`${inputField}${index}`}>
              <div className="">
                <input
                  type="text"
                  className="inputAnswer1"
                  placeholder="Enter poll option."
                  id="answer1"
                  name="answer1"
                  onChange={(event) => handleInputChange(index, event)}
                  value={inputField.answer1}
                />
                {index + 1 !== answers.length ? (
                  <FontAwesomeIcon
                    icon={faPlusSquare}
                    className="buttonPlusHidden"
                    type="button"
                    onClick={handleAddFields}
                  />
                ) : !isEnabledPlusButton ? (
                  <FontAwesomeIcon
                    icon={faPlusSquare}
                    className="buttonPlus fa-disabled"
                    type="button"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlusSquare}
                    className="buttonPlus"
                    type="button"
                    onClick={handleAddFields}
                  />
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </form>
      <button type="submit" className="buttonPoll" onClick={submitPoll}>
        Create Poll
      </button>
    </div>
  );
};
export default Home;
