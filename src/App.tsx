import produce from "immer";
import { uniq, flatten, unionBy } from "lodash";
import { useEffect, useState } from "react";
import "./styles.css";
import wordleList from "./wordleList.json";
import { getColor } from "./util/getColor";
import { emojiCreation } from "./util/emojiCreator";
import Keyboard from "./components/keyboard/keyboard";
import { Rounds } from "./@types";
import GameBoard from "./components/gameboard/gameboard";

// abbot (the word)
// toast (the guess, and messes up)

const initStatus: Rounds = [
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" }
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" }
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" }
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" }
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" }
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" }
  ]
];

const randomWordleWord =
  wordleList[Math.floor(Math.random() * wordleList.length - 1)];
// const randomWordleWord = "hello";

export default function App() {
  const [roundsData, setRoundsData] = useState<Rounds>(initStatus);
  const [currentRound, setCurrentRound] = useState(0);

  console.log("currentRound", currentRound);
  console.log("randomWordleWord", randomWordleWord);
  const flattenedRounds = flatten(roundsData);
  const letters = uniq(
    unionBy(
      flattenedRounds.filter(
        (guess) => guess.status !== "pending" && guess.status !== "none"
      ),
      (item) => item.letter
    )
  );

  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      console.log(e.key);

      console.log(e.keyCode);
      const isBackspace = e.keyCode === 8;
      const isEnter = e.keyCode === 13;

      // const reg = new RegExp();

      // console.log(e.key.match(/g{1}[a-z][A-Z]/));

      // if (isEnter) return;
      console.log("callback");

      setRoundsData(
        produce((draftState) => {
          const currentRoundItems = draftState[currentRound];

          if (!isBackspace) {
            const selectedItem = currentRoundItems.find(
              (thing) => thing.status === "none"
            );

            if (selectedItem) {
              selectedItem.letter = e.key;
              selectedItem.status = "pending";
            }
          } else {
            for (let i = currentRoundItems.length - 1; i >= 0; i--) {
              if (currentRoundItems[i].status === "pending") {
                currentRoundItems[i].status = "none";
                currentRoundItems[i].letter = "";
                return;
              }
            }
          }

          if (isEnter) {
            let winChecker = 0;

            const word = draftState[currentRound].reduce(
              (prevValue, currentValue) => prevValue + currentValue.letter,
              ""
            );

            console.log("WORD TROUBLE", word, wordleList.includes(word));

            if (!wordleList.includes(word)) {
              alert("NOT A WORD");
              return draftState;
            }

            setCurrentRound((p) => p + 1);

            console.log("word", word);

            currentRoundItems.forEach((item, i) => {
              console.log(randomWordleWord[i], e.key);
              if (randomWordleWord[i] === currentRoundItems[i].letter) {
                console.log("got it right", item.letter);
                winChecker++;
                item.status = "green";
              } else if (randomWordleWord.indexOf(item.letter) !== -1) {
                console.log("word is in the list");
                item.status = "yellow";
              } else {
                item.status = "wrong";
              }
            });
            if (winChecker === 5) {
              alert("WINNNNNNER");
            }
          }
        })
      );
    };
    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [currentRound]);

  console.log("roundsData", roundsData);

  return (
    <div className="App">
      <h2>Wordle Challenge</h2>
      <GameBoard roundsData={roundsData} />
      {letters.map((letter) => (
        <div
          key={letter.letter}
          style={{
            background: getColor(letter.status),
            display: "inline-block",
            color: "white",
            padding: 10,
            margin: 2,
            borderRadius: 6
          }}
        >
          {letter.letter}
        </div>
      ))}
      {emojiCreation(roundsData).slice(0, currentRound)}
      {console.log(emojiCreation(roundsData.slice(0, currentRound)))}
      <Keyboard />
    </div>
  );
}
