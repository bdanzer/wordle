import { GameTypes, Rounds, WordBoxValues } from "../../@types";
import WordleBox from "../wordle-box/wordle-box";
import React, { useEffect, useState } from "react";
import CompletedModalContent from "./completed-modal-content";
import FirstTimeModalContent from "./first-time-modal-content";
import GameSelectionModalContent from "./game-selection-modal-content";
import { useChallengerData } from "../../hooks/useChallengerData";
import { MiniModal } from "./mini-modal";

function GameBoard({
  roundsData,
  isFirstTime,
  priorityBoxIndex,
  activeRound,
  challengerData,
  isGameLost,
  isGameWon,
  challengeLink,
  miniBoard = false,
  showLetters = true,
  wordleWord,
  emojis,
  gameType,
  onStartOver,
  onWordBoxSelected,
}: {
  roundsData?: Rounds | null;
  isFirstTime?: Boolean;
  priorityBoxIndex?: number;
  activeRound?: number;
  challengerData?: Rounds | null;
  isGameLost?: boolean;
  isGameWon?: boolean;
  challengeLink?: string;
  miniBoard?: boolean;
  showLetters?: boolean;
  wordleWord?: string;
  emojis?: string;
  gameType?: GameTypes;
  onStartOver?: () => void;
  onWordBoxSelected?: (obj: WordBoxValues) => void;
  onGameSelection?: (game: GameTypes) => void;
}) {
  const [firstTimeModal, setFirstTimeModal] = useState(false);
  const isChallenged = Boolean(challengerData);
  const { challengerRowCompletion, completionTime } = useChallengerData();
  const windowWidth = window.innerWidth > 375 ? 375 : window.innerWidth;
  const marginToAccount = 5 * 2;
  const boxMargins = 2.5;
  const boxWidths = (windowWidth - (marginToAccount + boxMargins * 2)) / 5;
  const isGameOver = isGameLost || isGameWon;

  const handleFirstTimeComplete = () => {
    setFirstTimeModal(false);
    localStorage.setItem("hasPlayed", "true");
  };

  const handleWordBoxSelect = (roundRowIndex: number, wordBoxIndex: number) => {
    onWordBoxSelected?.({
      roundRowIndex,
      wordBoxIndex,
    });
  };

  useEffect(() => {
    if (isFirstTime) {
      setFirstTimeModal(true);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
        maxWidth: miniBoard ? 160 : 365,
        margin: "auto",
        marginTop: miniBoard ? 0 : 0,
      }}
    >
      {!gameType && !miniBoard && (
        <MiniModal>
          <GameSelectionModalContent onGameSelection={() => {}} />
        </MiniModal>
      )}
      {firstTimeModal && (
        <MiniModal>
          <FirstTimeModalContent onComplete={handleFirstTimeComplete} />
        </MiniModal>
      )}
      {isGameOver && (
        <MiniModal>
          <CompletedModalContent
            roundsData={roundsData}
            challengerData={challengerData}
            isGameWon={isGameWon}
            isChallenged={isChallenged}
            wordleWord={wordleWord}
            challengeLink={challengeLink}
            onStartOver={onStartOver}
            isGameLost={isGameLost}
            emojis={emojis}
          />
        </MiniModal>
      )}
      {roundsData?.map((row, roundRowIndex) => (
        <div key={roundRowIndex} style={{ display: "flex" }}>
          {row.map((letterData, letterPosition) => {
            const testId = `${
              challengerData && miniBoard ? "challenger-" : ""
            }${
              miniBoard ? "miniboard-" : ""
            }gameboard-${roundRowIndex}-${letterPosition}`;

            return (
              <WordleBox
                key={letterPosition}
                testId={testId}
                onSelect={() => {
                  if (activeRound === roundRowIndex) {
                    handleWordBoxSelect(roundRowIndex, letterPosition);
                  }
                }}
                hasChallengerMet={
                  !miniBoard && challengerRowCompletion === roundRowIndex
                }
                hasPriority={
                  roundRowIndex === activeRound &&
                  priorityBoxIndex === letterPosition
                }
                pointer={roundRowIndex === activeRound}
                selected={letterData.status === "selected"}
                letter={letterData.letter}
                status={letterData.status}
                showLetters={showLetters}
                miniBoard={miniBoard}
                width={boxWidths}
                margin={boxMargins}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default React.memo(GameBoard);
