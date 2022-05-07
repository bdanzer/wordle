import produce from "immer";
import { flatten, trim } from "lodash";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import wordleList from "./wordleList.json";
import {
  acceptedInputs,
  buildWord,
  deleteLetters,
  getBoxPriorityPosition,
  getItemStatus,
  getLocalGame,
  homeUrl,
  initStatus,
  saveGame,
} from "./util/game";
import { emojiCreation } from "./util/emojiCreator";
import Keyboard from "./components/keyboard/keyboard";
import { GameType, Rounds, WordBoxValues } from "./@types";
import GameBoard from "./components/gameboard/gameboard";
import useChallenge from "./hooks/useChallenge";
import useUrlHelper from "./hooks/useUrlHelper";

import "./styles.css";
import { useNavigate } from "react-router";

export default function App({
  challengerData,
  wordleWord,
  newWordleWord,
  isFirstTime,
  randomWord,
}: {
  challengerData: Rounds | null;
  wordIndex: number | null;
  wordleWord: string;
  newWordleWord: () => void;
  isFirstTime: boolean;
  randomWord: string;
}) {
  const [roundsData, setRoundsData] = useState<Rounds>(initStatus);
  const [currentRound, setCurrentRound] = useState(0);
  const [isNotAWord, setNotAWord] = useState(false);
  const [isGameWon, setGameWon] = useState(false);
  const [isGameLost, setGameLost] = useState(false);
  const [title, setTitle] = useState("A Wordle Challenge Game!");
  const { generateChallengeLink } = useChallenge();
  const { getGameType } = useUrlHelper();
  const navigate = useNavigate();

  const gameId = getGameType();
  const localGame = gameId === "NYT" ? getLocalGame(gameId) : null;

  const emojis = emojiCreation(roundsData.slice(0, currentRound + 1));
  const currentWord = buildWord(roundsData[currentRound]);
  const word = gameId === "NYT" ? wordleWord : randomWord;

  console.log("Current Round", currentRound);
  console.log("Wordle Word", word);
  console.log("Rounds Data", roundsData);
  console.log("Challenger Data", challengerData);

  const priorityBoxIndex = getBoxPriorityPosition(roundsData[currentRound]);

  console.log({ roundsData, priorityBoxIndex });

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
    const link = generateChallengeLink(roundsData, word);
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
          if (guessedWord.length !== 5 || !wordleList.includes(guessedWord))
            return;

          const isWin = guessedWord === word;
          const nextRoundLetters =
            currentRound + 1 > 5 || isWin ? null : draftState[currentRound + 1];

          //Add statuses to words
          currentRoundItems.forEach((letterData, i) => {
            const isLetterLocked = letterData.status === "locked";
            const status = getItemStatus(word, guessedWord, i);

            letterData.status = status;

            if (status === "green" && isLetterLocked && nextRoundLetters) {
              nextRoundLetters[i].letter = letterData.letter;
              nextRoundLetters[i].status = "locked";
            }
          });

          // Set correct rounds as we enter
          setCurrentRound((prevRound) => {
            const nextRound = prevRound + 1;
            if (isWin) {
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
            // TODO: Need to rework to pull from priority position function for a centralized spot
            const selectedStatusItem =
              currentRoundItems.find(
                (letterData) =>
                  letterData.status === "selected" && !letterData.letter
              ) ||
              currentRoundItems.find(
                (letterData) => letterData.status === "selected"
              );
            const selectedNoneItem = currentRoundItems.find(
              (letterData) => letterData.status === "none"
            );

            if (selectedStatusItem) {
              if (!selectedStatusItem.letter) {
                selectedStatusItem.status = "selected";
              } else {
                selectedStatusItem.status = "pending";
              }
              selectedStatusItem.letter = key;
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
  }, [currentRound, isGameLost, isGameWon, word]);

  useEffect(() => {
    if (isGameWon) {
      saveGame(gameId, roundsData, word, "W");
    }
  }, [isGameWon]);

  useEffect(() => {
    if (isGameLost) {
      saveGame(gameId, roundsData, word, "L");
    }
  }, [isGameLost]);

  const handleStartOver = () => {
    setGameWon(false);
    setGameLost(false);
    setCurrentRound(0);
    setRoundsData(initStatus);
    newWordleWord();

    if (
      (!getLocalGame(GameType.Official) && gameId === "Random") ||
      gameId === "NYT"
    ) {
      navigate(homeUrl, { replace: true });
    }
  };

  return (
    <div className="App">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Send Wordle Challenges" />
      </Helmet>
      <div style={{ marginBottom: 6 }}>
        <GameBoard
          roundsData={localGame?.gameBoard || roundsData}
          isFirstTime={isFirstTime}
          priorityBoxIndex={priorityBoxIndex}
          activeRound={currentRound}
          challengerData={challengerData}
          isGameWon={localGame?.outcome === "W" || isGameWon}
          isGameLost={localGame?.outcome === "L" || isGameLost}
          onChallenge={handleChallenge}
          onStartOver={handleStartOver}
          challengeLink={generateChallengeLink(roundsData, word)}
          wordleWord={word}
          gameType={gameId}
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
