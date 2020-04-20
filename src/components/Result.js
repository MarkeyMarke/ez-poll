import React, { useState, Fragment, useEffect, useRef } from "react";
import { NavLink, Link, useHistory, useLocation } from "react-router-dom";
import "../styles/Result.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAlert } from "react-alert";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const Result = () => {
  const history = useHistory();
  const alert = useAlert();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [uniqueID, setUniqueID] = useState(null);
  //We use useRef and _setAnswes to let EventListeners have access to the state
  const answersRef = useRef(answers);
  const _setAnswers = (data) => {
    answersRef.current = data;
    setAnswers(data);
  };

  //Handling the set value for percentage
  const handleInputChange = (numberVotes) => {
    var index = 0;
    var total = 0;
    for (index = 0; index < answers.length; index++) {
      total = total + Number(answers[index].answerCount);
    }
    return Number(((numberVotes / total) * 100).toFixed(1));
  };

  //Function for getting the unique id
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();

  useEffect(() => {
    getData();
  }, []);

  //Calling the database
  const getData = async () => {
    //Check browser link first
    let uniqueID = query.get("uid");
    if (uniqueID) {
      setUniqueID(uniqueID);
    } else {
      history.push("/error");
      return;
    }

    //Fetch from Firebase DB and initialize state
    const poll = await fetch(
      `https://ez-poll.firebaseio.com/qna/${uniqueID}.json`
    );
    if (!poll.ok) {
      history.push("/error");
      return;
    }
    const pollJSON = await poll.json();
    if (pollJSON == null) {
      history.push("/error");
      return;
    } else {
      setQuestion(pollJSON.question);
      _setAnswers(pollJSON.answers);
    }

    //Create an event listener for updates to Firebase DB
    let event = new EventSource(
      `https://ez-poll.firebaseio.com/qna/${uniqueID}/answers.json`
    );
    event.addEventListener("put", (e) => {
      //Firebase returns a path string and the updated data. On first loadup, we'll get a path "/" with all the data in the JSON tree
      const eventJSON = JSON.parse(e.data);
      const path = eventJSON.path.replace(/\D/g, "");
      const newAnswerCount = eventJSON.data;

      //This if statement prevents updating the data on loadup, so we only listen to actual individual updates only
      if (path.length > 0 && answersRef.current.length > 0) {
        const index = parseInt(path);
        let newAnswers = [...answersRef.current];
        let oldAnswer = newAnswers[index];
        newAnswers[index] = { ...oldAnswer, answerCount: newAnswerCount };
        _setAnswers(newAnswers);
      }
    });
  };

  //Handling the new button
  const newPoll = async (e) => {
    e.preventDefault();
    history.push("/");
  };

  if (!answers || !question || !uniqueID) {
    return (
      <div className="Vote">
        <h1 className="votePageLogo">EZ Poll</h1>
        <div className="votePageBoxContainer">
          <div className="votePageBox">
            <label className="votePageLoadingText">Loading results...</label>
            <div style={{ height: "10px" }}></div>
            <Loader type="Oval" color="#b2e5ff" height={150} width={150} />
            <div style={{ height: "10px" }}></div>
          </div>
        </div>
        <button type="submit" className="buttonPoll" onClick={newPoll}>
          New Poll
        </button>
      </div>
    );
  }

  return (
    <div className="Result">
      <h1 className="textLogo">EZ Poll</h1>
      <form className="form">
        <div>
          <div className="inputQuestion">{question}</div>
          {answers.map((inputField, index) => (
            <Fragment key={index}>
              <div className="resultsAnswer">
                <div className="row">
                  <div className="column">
                    <label className="inputAnswerQuestion">
                      {inputField.answer}
                    </label>
                  </div>
                  <div className="column">
                    <label className="inputAnswerVotes">
                      {inputField.answerCount + " votes"}
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="column">
                    {index.answerCount === 0 ? (
                      <div
                        className="w3-progress"
                        style={{
                          width:
                            handleInputChange(inputField.answerCount) + "%",
                        }}
                      />
                    ) : (
                      <div
                        className="w3-progress"
                        style={{
                          width:
                            handleInputChange(inputField.answerCount) + "%",
                        }}
                      >
                        |
                      </div>
                    )}
                  </div>
                  <div className="column">
                    <label className="inputAnswerVotes">
                      {handleInputChange(inputField.answerCount) + "%"}
                    </label>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </form>
      <CopyToClipboard
        text={`${window.location.host}/vote?uid=${uniqueID}`}
        onCopy={() => alert.show("Share URL Copied to clipboard")}
      >
        <button type="submit" className="buttonPoll">
          Share
        </button>
      </CopyToClipboard>
      <button type="submit" className="buttonPoll" onClick={newPoll}>
        New Poll
      </button>
    </div>
  );
};
export default Result;
