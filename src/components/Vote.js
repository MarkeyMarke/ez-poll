import React, { useState, Fragment, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/Vote.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAlert } from "react-alert";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const Vote = () => {
  const history = useHistory();
  const alert = useAlert();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);
  const [uniqueID, setUniqueID] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  let query = new URLSearchParams(useLocation().search);

  const getData = async () => {
    //Check browser link first
    let uniqueID = query.get("uid");
    if (uniqueID) {
      setUniqueID(uniqueID);
    } else {
      history.push("/error");
      return;
    }

    //Fetch from Firebase
    const answersResponse = await fetch(
      `https://ez-poll.firebaseio.com/qna/${uniqueID}.json`
    );
    const answersResponseJSON = await answersResponse.json();
    if (answersResponseJSON) {
      setQuestion(answersResponseJSON.question);
      setAnswers(answersResponseJSON.answers);
    } else {
      history.push("/error");
      return;
    }
  };

  const onSubmitButton = async (e) => {
    e.preventDefault();
    //Grab most recent vote count snapshot
    const mostRecentAnswers = await fetch(
      `https://ez-poll.firebaseio.com/qna/${uniqueID}.json`
    );
    if (!mostRecentAnswers.ok) {
      history.push("/error");
      return;
    }
    const recentAnswerJSON = await mostRecentAnswers.json();
    if (recentAnswerJSON == null) {
      history.push("/error");
      return;
    }
    //Increment vote count locally
    const newAnswers = recentAnswerJSON.answers;
    const oldAnswer = newAnswers[selectedAnswerIndex];
    const oldAnswerCount = oldAnswer.answerCount;
    const newAnswer = { ...oldAnswer, answerCount: oldAnswerCount + 1 };
    //Update value in Firebase Database
    const response = await fetch(
      `https://ez-poll.firebaseio.com/qna/${uniqueID}/answers/${selectedAnswerIndex}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnswer),
      }
    );
    if (!response.ok) {
      history.push("/error");
      return;
    }
    history.push(`/results?uid=${uniqueID}`);
  };

  const onNewPollButton = async (e) => {
    e.preventDefault();
    history.push("/");
  };

  const boxContent = () => {
    return (
      <div className="votePageBox">
        <div className="votePageQuestionText">{question}</div>
        <div className="votePageAnswersContainer">
          {answers.map((answer, index) => (
            <Fragment key={index}>
              <div className="radio">
                <label className="votePageAnswersText">
                  <input
                    type="radio"
                    value={answer.answer}
                    checked={index === selectedAnswerIndex}
                    className="radioCircle"
                    onChange={() => setSelectedAnswerIndex(index)}
                  />
                  {answer.answer}
                </label>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    );
  };

  if (!answers || !question || !uniqueID) {
    return (
      <div className="Vote">
        <h1 className="votePageLogo">EZ Poll</h1>
        <div className="votePageBoxContainer">
          <div className="votePageBox">
            <label className="votePageLoadingText">Loading poll...</label>
            <div style={{ height: "10px" }}></div>
            <Loader type="Oval" color="#b2e5ff" height={150} width={150} />
            <div style={{ height: "10px" }}></div>
          </div>
        </div>
        <button type="submit" className="buttonPoll" onClick={onNewPollButton}>
          New Poll
        </button>
      </div>
    );
  }

  return (
    <div className="Vote">
      <h1 className="votePageLogo">EZ Poll</h1>
      <div className="votePageBoxContainer">
        {answers && question && boxContent()}
      </div>
      <button type="submit" className="buttonPoll" onClick={onSubmitButton}>
        Submit
      </button>
      <CopyToClipboard
        text={window.location.href}
        onCopy={() => alert.show("Share URL Copied to clipboard")}
      >
        <button type="submit" className="buttonPoll">
          Share
        </button>
      </CopyToClipboard>
      <button type="submit" className="buttonPoll" onClick={onNewPollButton}>
        New Poll
      </button>
    </div>
  );
};

export default Vote;
