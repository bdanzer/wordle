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
  getRoundsLetters,
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

import "./styles.css";
import { useNavigate } from "react-router";
import { useCurrentWord } from "./hooks/useCurrentWord";
import { useChallengerData } from "./hooks/useChallengerData";
import { black } from "./util/getColor";
import { useTimer } from "use-timer";

function GameBoardHeader({
  time,
  completionTime,
}: {
  time?: number;
  completionTime: number | null;
}) {
  return (
    <div
      style={{
        left: 0,
        // cursor: "pointer",
        width: "100%",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <svg
          fill={black}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          style={{
            cursor: "pointer",
          }}
        >
          <path d="M 10.490234 2 C 10.011234 2 9.6017656 2.3385938 9.5097656 2.8085938 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 5.2851562 5.2480469 C 4.8321563 5.0920469 4.33375 5.2793594 4.09375 5.6933594 L 2.5859375 8.3066406 C 2.3469375 8.7216406 2.4339219 9.2485 2.7949219 9.5625 L 4.1132812 10.708984 C 4.0447181 11.130337 4 11.559284 4 12 C 4 12.440716 4.0447181 12.869663 4.1132812 13.291016 L 2.7949219 14.4375 C 2.4339219 14.7515 2.3469375 15.278359 2.5859375 15.693359 L 4.09375 18.306641 C 4.33275 18.721641 4.8321562 18.908906 5.2851562 18.753906 L 6.9296875 18.1875 C 7.5958842 18.734206 8.3553934 19.166339 9.1757812 19.476562 L 9.5097656 21.191406 C 9.6017656 21.661406 10.011234 22 10.490234 22 L 13.509766 22 C 13.988766 22 14.398234 21.661406 14.490234 21.191406 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 18.714844 18.751953 C 19.167844 18.907953 19.66625 18.721641 19.90625 18.306641 L 21.414062 15.691406 C 21.653063 15.276406 21.566078 14.7515 21.205078 14.4375 L 19.886719 13.291016 C 19.955282 12.869663 20 12.440716 20 12 C 20 11.559284 19.955282 11.130337 19.886719 10.708984 L 21.205078 9.5625 C 21.566078 9.2485 21.653063 8.7216406 21.414062 8.3066406 L 19.90625 5.6933594 C 19.66725 5.2783594 19.167844 5.0910937 18.714844 5.2460938 L 17.070312 5.8125 C 16.404116 5.2657937 15.644607 4.8336609 14.824219 4.5234375 L 14.490234 2.8085938 C 14.398234 2.3385937 13.988766 2 13.509766 2 L 10.490234 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z" />
        </svg>
        <span>
          Your time {time}s{" "}
          {completionTime ? `- Their time ${completionTime}s` : ""}
        </span>
      </div>
    </div>
  );
}

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
