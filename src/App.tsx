import produce from "immer";
import { trim } from "lodash";
import { useCallback, useEffect, useState } from "react";
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
import { GameType, Outcome, Rounds, WordBoxValues } from "./@types";
import GameBoard from "./components/gameboard/gameboard";
import useChallenge from "./hooks/useChallenge";
import useUrlHelper from "./hooks/useUrlHelper";
import { useNavigate } from "react-router";
import { useCurrentWord } from "./hooks/useCurrentWord";
import { useChallengerData } from "./hooks/useChallengerData";
import { useTimer } from "use-timer";
import { GameBoardHeader } from "./components/gameboard/gameboard-header";

import "./styles.css";

export default function App({ isFirstTime }: { isFirstTime: boolean }) {
  const [roundsData, setRoundsData] = useState<Rounds>(initStatus);
  console.log({ roundsData });
  const [currentRound, setCurrentRound] = useState(0);
  const [isNotAWord, setNotAWord] = useState(false);
  const [isGameWon, setGameWon] = useState(false);
  const [isGameLost, setGameLost] = useState(false);
  const { generateChallengeLink } = useChallenge();
  const { getGameType } = useUrlHelper();
  const navigate = useNavigate();
  const { officialWord, randomWord, generateNewWord } = useCurrentWord();
  const { challengerGameData: challengerData, completionTime } =
    useChallengerData();

  const gameId = getGameType();
  const localGame = gameId === GameType.Official ? getLocalGame(gameId) : null;

  const roundsDataToUse =
    (!challengerData && localGame?.gameBoard) || roundsData;

  const emojis = emojiCreation(roundsData.slice(0, currentRound + 1));
  const currentWord = buildWord(roundsData[currentRound]);
  const word =
    gameId === GameType.Official && !challengerData ? officialWord : randomWord;

  const gameWon =
    (gameId === GameType.Official &&
      localGame?.outcome === Outcome.W &&
      !challengerData) ||
    isGameWon;
  const gameLost =
    (gameId === GameType.Official &&
      localGame?.outcome === Outcome.L &&
      !challengerData) ||
    isGameLost;

  const isGameOver = gameWon || gameLost;

  const priorityBoxIndex = getBoxPriorityPosition(roundsData[currentRound]);

  const { start, pause, time, reset } = useTimer({
    onTimeOver: () => {
      pause();
    },
    timerType: "INCREMENTAL",
    initialTime: 0,
    // endTime: 0,
  });

  const handleWordBoxSelected = useCallback((wordBoxValues: WordBoxValues) => {
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
  }, []);

  const handleLetter = useCallback(
    (e?: KeyboardEvent | null, letter?: string) => {
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
              currentRound + 1 > 5 || isWin
                ? null
                : draftState[currentRound + 1];

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
                selectedStatusItem.status = "pending";
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
    },
    [isGameWon, isGameLost]
  );

  const handleLetterSelection = useCallback(
    (letter) => handleLetter(null, letter),
    [handleLetter]
  );

  const handleStartOver = useCallback(() => {
    setGameWon(false);
    setGameLost(false);
    setCurrentRound(0);
    setRoundsData(initStatus);
    generateNewWord();
    reset();

    if (
      (!getLocalGame(GameType.Official) && gameId === "Random") ||
      gameId === "NYT"
    ) {
      navigate(homeUrl, { replace: true });
    }
  }, [navigate, gameId]);

  useEffect(() => {
    if (isGameOver) {
      pause();
    }
  }, [isGameOver]);

  useEffect(() => {
    if (gameId && currentRound !== 0) {
      start();
    }

    return () => {
      pause();
    };
  }, [gameId, currentRound]);

  useEffect(() => {
    if (isGameWon) {
      saveGame(gameId, roundsData, word, Outcome.W);
    }
  }, [isGameWon]);

  useEffect(() => {
    if (isGameLost) {
      saveGame(gameId, roundsData, word, Outcome.L);
    }
  }, [isGameLost]);

  useEffect(() => {
    document.addEventListener("keydown", handleLetter);
    return () => {
      document.removeEventListener("keydown", handleLetter);
    };
  }, [currentRound, isGameLost, isGameWon, word]);

  return (
    <div className="App" data-testid={word}>
      <div style={{ visibility: "hidden" }} data-testid={gameId}>
        {gameId}
      </div>
      <Helmet>
        <title>A Wordle Challenge Game!</title>
        <meta name="description" content="Send Wordle Challenges" />
      </Helmet>
      <div style={{ marginBottom: 6, maxWidth: 365, margin: "auto" }}>
        <GameBoardHeader time={time} completionTime={completionTime} />
        <GameBoard
          roundsData={roundsDataToUse}
          isFirstTime={isFirstTime}
          priorityBoxIndex={priorityBoxIndex}
          activeRound={currentRound}
          challengerData={challengerData}
          isGameWon={gameWon}
          isGameLost={gameLost}
          onStartOver={handleStartOver}
          challengeLink={generateChallengeLink(roundsData, word)}
          wordleWord={word}
          gameType={gameId}
          emojis={emojis}
          onWordBoxSelected={handleWordBoxSelected}
        />
      </div>
      <Keyboard
        roundsData={roundsDataToUse}
        onLetterSelection={handleLetterSelection}
        notAWord={isNotAWord}
        wordComplete={currentWord.length === 5}
      />
      {/* <MatchHistory gameType={gameId} /> */}
    </div>
  );
}
