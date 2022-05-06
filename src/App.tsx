import produce from "immer";
import { flatten, trim } from "lodash";
import { useEffect, useState } from "react";
import "./styles.css";
import wordleList from "./wordleList.json";
import qs from "query-string";
import {
  acceptedInputs,
  buildWord,
  deleteLetters,
  findWordIndex,
  getItemStatus,
  homeUrl,
} from "./util/game";
import { emojiCreation } from "./util/emojiCreator";
import Keyboard from "./components/keyboard/keyboard";
import { Rounds, WordBoxValues } from "./@types";
import GameBoard from "./components/gameboard/gameboard";
import { useLocation } from "react-router";

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

function useChallenge() {
  const location = useLocation();
  return {
    generateChallengeLink: (roundsData: Rounds, randomWord: string) => {
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
  const { generateChallengeLink } = useChallenge();

  const emojis = emojiCreation(roundsData.slice(0, currentRound + 1));
  const currentWord = buildWord(roundsData[currentRound]);

  console.log("currentRound", currentRound);
  console.log("wordleWord", wordleWord);
  console.log("Rounds Data", roundsData);

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

  const handleChallenge = () => {
    const stringifiedRoundsData = JSON.stringify(roundsData);
    const link = generateChallengeLink(roundsData, wordleWord);
  };

  const handleWordBoxSelected = (wordBoxValues: WordBoxValues) => {
    console.log("running", wordBoxValues);
    setRoundsData(
      produce((draftState) => {
        const selectedLetterBox =
          draftState[wordBoxValues.roundRowIndex][wordBoxValues.wordBoxIndex];

        if (
          selectedLetterBox.status === "selected" &&
          selectedLetterBox.letter
        ) {
          selectedLetterBox.status = "locked";
        } else if (selectedLetterBox.status === "locked") {
          selectedLetterBox.status = "pending";
        } else if (
          selectedLetterBox.status === "selected" &&
          !selectedLetterBox.letter
        ) {
          selectedLetterBox.status = "none";
        } else {
          selectedLetterBox.status = "selected";
        }
      })
    );
  };

  const handleLetter = (e?: KeyboardEvent | null, letter?: string) => {
    const key = trim(e?.key || letter);
    const isBackspace = key === "Backspace";
    const isEnter = key === "Enter";

    // No need to continue if game is over or new specified key or letter
    if (isGameWon || isGameLost || !key) return;

    // Basic validation for the accepted inputs
    if (![...acceptedInputs, "Enter"].includes(key)) return;

    setRoundsData(
      produce((draftState) => {
        const currentRoundItems = draftState[currentRound];

        if (isEnter) {
          const guessedWord = buildWord(currentRoundItems);
          if (guessedWord.length !== 5) return;

          let winChecker = 0;

          //Add statuses to words
          currentRoundItems.forEach((letterData, i) => {
            const status = getItemStatus(wordleWord, guessedWord, i);
            letterData.status = status;
            if (status === "green") {
              winChecker++;
            }
          });

          // Set correct rounds as we enter
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
        } else {
          // Handling the typing/deleting phase of the game
          if (!isBackspace) {
            const selectedStatusItem = currentRoundItems.find(
              (letterData) => letterData.status === "selected"
            );
            const selectedNoneItem = currentRoundItems.find(
              (letterData) => letterData.status === "none"
            );

            if (selectedStatusItem) {
              selectedStatusItem.letter = key;
              selectedStatusItem.status = "pending";
            } else if (selectedNoneItem) {
              selectedNoneItem.letter = key;
              selectedNoneItem.status = "pending";
            }
          } else {
            deleteLetters(currentRoundItems)("selected");
          }

          const guessedWord = buildWord(currentRoundItems);

          // Finally check if the word is in the list after the letter has been added
          if (!wordleList.includes(guessedWord) && guessedWord.length === 5) {
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
          activeRound={currentRound}
          challengerData={challengerData}
          isGameWon={isGameWon}
          isGameLost={isGameLost}
          onChallenge={handleChallenge}
          onStartOver={handleStartOver}
          challengeLink={generateChallengeLink(roundsData, wordleWord)}
          wordleWord={wordleWord}
          emojis={emojis}
          onWordBoxSelected={handleWordBoxSelected}
        />
      </div>
      <Keyboard
        onLetterSelection={(letter) => handleLetter(null, letter)}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        failedLetters={failedLetters}
        notAWord={isNotAWord}
        wordComplete={currentWord.length === 5}
      />
    </div>
  );
}
