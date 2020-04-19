import React, { useState, Fragment, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/Vote.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAlert } from "react-alert";

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
    const getUser = await fetch(
      `https://ez-poll.firebaseio.com/qna/${uniqueID}.json`
    );
    const resUserData = await getUser.json();
    if (resUserData) {
      setQuestion(resUserData.question);
      setAnswers(resUserData.answers);
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
    newAnswers[selectedAnswerIndex] = {
      ...oldAnswer,
      answerCount: oldAnswer.answerCount + 1,
    };
    //Update value in Firebase Database
    const response = await fetch(
      `https://ez-poll.firebaseio.com/qna/${uniqueID}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answers: newAnswers,
        }),
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

  const actualAnswers = () => {
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

  return (
    <div className="Vote">
      <h1 className="votePageLogo">EZ Poll</h1>
      <div className="votePageBoxContainer">
        {answers && question && actualAnswers()}
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
