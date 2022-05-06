import produce from "immer";
import { uniq, flatten, unionBy, trim } from "lodash";
import { useEffect, useState } from "react";
import "./styles.css";
import wordleList from "./wordleList.json";
import { getColor } from "./util/getColor";
import qs from "query-string";
import {
  acceptedInputs,
  buildWord,
  findWordIndex,
  getRandomWord,
  guessColor,
  homeUrl,
} from "./util/game";
import { emojiCreation } from "./util/emojiCreator";
import Keyboard from "./components/keyboard/keyboard";
import { Rounds } from "./@types";
import GameBoard from "./components/gameboard/gameboard";
import { useLocation } from "react-router";

// abbot (the word)
// toast (the guess, and messes up)
// bobby messes up

// pryce
// soare messes up (no r detected)

const initStatus: Rounds = [
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
];

// const wordleWord =
//   wordleList[Math.floor(Math.random() * wordleList.length - 1)];
// const wordleWord = getRandomWord("abbot");
// const wordleWord = "pryce";

function useChallenge() {
  const location = useLocation();
  return {
    challengeLink: (roundsData: Rounds, randomWord: string) => {
      console.log("location", location);
      const wordIndex = findWordIndex(randomWord);
      const challengerGameData = JSON.stringify(roundsData);
      const stringUrl = qs.stringify({ wordIndex, challengerGameData });
      return `${document.location.origin}${homeUrl}?${stringUrl}`;
    },
  };
}

export default function App({
  challengerData,
  wordleWord,
  newWordleWord,
}: {
  challengerData: Rounds | null;
  wordIndex: number | null;
  wordleWord: string;
  newWordleWord: () => void;
}) {
  const [roundsData, setRoundsData] = useState<Rounds>(initStatus);
  const [currentRound, setCurrentRound] = useState(0);
  const [isNotAWord, setNotAWord] = useState(false);
  const [isGameWon, setGameWon] = useState(false);
  const [isGameLost, setGameLost] = useState(false);
  const { challengeLink } = useChallenge();

  const emojis = emojiCreation(roundsData.slice(0, currentRound + 1));
  console.log("currentRound", currentRound);
  console.log("wordleWord", wordleWord);

  const flattenedRounds = flatten(roundsData);

  const greenLetters = flattenedRounds
    .filter((thing) => thing.status === "green")
    .map((letters) => letters.letter);

  const yellowLetters = flattenedRounds
    .filter((thing) => thing.status === "yellow")
    .map((letters) => letters.letter);

  const failedLetters = flattenedRounds
    .filter((thing) => thing.status === "wrong")
    .map((letters) => letters.letter);

  const word = buildWord(roundsData[currentRound]);

  const handleChallenge = () => {
    const stringifiedRoundsData = JSON.stringify(roundsData);
    console.log(stringifiedRoundsData);
    const link = challengeLink(roundsData, wordleWord);
    console.log("link", link);
  };

  const handleLetter = (e?: KeyboardEvent | null, letter?: string) => {
    const key = trim(e?.key || letter);
    const isBackspace = e?.key === "Backspace" || letter === "Backspace";
    const isEnter = e?.key === "Enter" || letter === "Enter";

    if (isGameWon || isGameLost) return;

    if (![...acceptedInputs, "Enter"].includes(key)) return;

    setRoundsData(
      produce((draftState) => {
        const currentRoundItems = draftState[currentRound];

        let word = buildWord(currentRoundItems);

        if (isEnter && word.length === 5) {
          let winChecker = 0;

          currentRoundItems.forEach((item, i) => {
            const indexOfLetter = wordleWord.indexOf(item.letter);

            if (wordleWord[i] === item.letter) {
              winChecker++;
              item.status = "green";
            } else if (indexOfLetter !== -1) {
              item.status = guessColor(wordleWord, word, i);
            } else {
              item.status = "wrong";
            }
          });

          setCurrentRound((prevRound) => {
            const nextRound = prevRound + 1;
            if (winChecker === 5) {
              setGameWon(true);
              return prevRound;
            } else if (nextRound > 5) {
              setGameLost(true);
              return prevRound;
            }

            return nextRound;
          });
        } else if (!isEnter) {
          if (!isBackspace) {
            const selectedItem = currentRoundItems.find(
              (thing) => thing.status === "none"
            );

            if (selectedItem) {
              selectedItem.letter = key;
              selectedItem.status = "pending";
            }
          } else {
            for (let i = currentRoundItems.length - 1; i >= 0; i--) {
              if (currentRoundItems[i].status === "pending") {
                currentRoundItems[i].status = "none";
                currentRoundItems[i].letter = "";
                break;
              }
            }
          }

          word = buildWord(currentRoundItems);

          if (!wordleList.includes(word) && word.length === 5) {
            setNotAWord(true);
            return;
          } else {
            setNotAWord(false);
          }
        }
      })
    );
  };

  useEffect(() => {
    document.addEventListener("keydown", handleLetter);
    return () => {
      document.removeEventListener("keydown", handleLetter);
    };
  }, [currentRound, isGameLost, isGameLost, wordleWord]);

  const handleStartOver = () => {
    setGameWon(false);
    setGameLost(false);
    setCurrentRound(0);
    setRoundsData(initStatus);
    newWordleWord();
  };

  return (
    <div className="App">
      <div style={{ marginBottom: 6 }}>
        <GameBoard
          roundsData={roundsData}
          challengerData={challengerData}
          isGameWon={isGameWon}
          isGameLost={isGameLost}
          onChallenge={handleChallenge}
          onStartOver={handleStartOver}
          challengeLink={challengeLink(roundsData, wordleWord)}
          wordleWord={wordleWord}
          emojis={emojis}
        />
      </div>
      <Keyboard
        onLetterSelection={(letter) => handleLetter(null, letter)}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        failedLetters={failedLetters}
        notAWord={isNotAWord}
        wordComplete={word.length === 5}
      />
    </div>
  );
}
