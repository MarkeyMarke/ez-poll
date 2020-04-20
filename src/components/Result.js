import React, { useState, Fragment, useEffect } from "react";
import { NavLink, Link, useHistory, useLocation } from "react-router-dom";
import "../styles/Result.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAlert } from "react-alert";

const Result = () => {
  const history = useHistory();
  const alert = useAlert();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [uniqueID, setUniqueID] = useState(null);

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

  //Calling the function
  let query = useQuery();

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
      setAnswers(pollJSON.answers);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //Handling the share button
  const sharePoll = async (e) => {
    e.preventDefault();
    history.push("/");
  };

  //Handling the new button
  const newPoll = async (e) => {
    e.preventDefault();
    history.push("/");
  };

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
                        N/A
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
