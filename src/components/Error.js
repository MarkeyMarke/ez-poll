import React from "react";
import { useHistory, useLocation } from "react-router-dom";

const Error = () => {
  const history = useHistory();

  const onNewPollButton = async (e) => {
    e.preventDefault();
    history.push("/");
  };

  return (
    <div className="Vote">
      <h1 className="votePageLogo">EZ Poll</h1>
      <div className="votePageBoxContainer">
        <div className="votePageBox">
          <label className="votePageAnswersText">
            There was an error in the URL
          </label>
        </div>
      </div>
      <button type="submit" className="buttonPoll" onClick={onNewPollButton}>
        New Poll
      </button>
    </div>
  );
};

export default Error;
