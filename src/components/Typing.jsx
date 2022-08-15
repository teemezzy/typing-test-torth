import React, { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
const NUMB_OF_WORDS = 300;
const SECONDS = 60;

const Typing = () => {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  const generateWords = () => {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  };

  const start = () => {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return SECONDS;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  };

  const handleKeyDown = ({ keyCode, key }) => {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  };

  const checkMatch = () => {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  };

  const getCharClass = (wordIdx, charIdx, word) => {
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (word === currChar) {
        return "has-background-success";
      } else {
        return "has-background-danger";
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return "has-background-danger";
    } else {
      return "";
    }
  };

  return (
    <>
      <div className="section">
        <div className="is-size-1 has-text-centered text-red-600">
          <h2>{countDown}</h2>
        </div>
      </div>
      {status === "started" && (
        <div className="">
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, index) => (
                  <span key={index}>
                    <span>
                      {word.split("").map((word, id) => (
                        <span
                          className={getCharClass(index, id, word)}
                          key={id}
                        >
                          {word}
                        </span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute:</p>
              <p className="text-[#6A52FD] is-size-1">{correct}</p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuracy:</p>
              {correct !== 0 ? (
                <p className="text-[#FD52AB] is-size-1">
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </p>
              ) : (
                <p className="text-[#FD52AB] is-size-1">0%</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="control w-[968px] m-auto section">
        <input
          ref={textInput}
          disabled={status !== "started"}
          type="text"
          className="border-2 w-full px-3 outline-[#6A52FD] h-[56px] rounded-lg bg-[#F6F4FF]"
          onKeyDown={handleKeyDown}
          value={currInput}
          onChange={(e) => setCurrInput(e.target.value)}
        />
      </div>

      <div className="w-96 m-auto">
        <button className=" py-[18px] rounded-lg bg-[#6A52FD] text-white w-full" onClick={start}>
          Start Typing
        </button>
      </div>
    </>
  );
};

export default Typing;
