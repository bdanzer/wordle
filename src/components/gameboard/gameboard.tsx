import { Rounds, WordBoxValues } from "../../@types";
import WordleBox from "../wordle-box/wordle-box";
import { ReactNode } from "react";
import { black } from "../../util/getColor";
import CompletedModalContent from "./completed-modal-content";

function MiniModal({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "white",
        position: "absolute",
        height: "calc(100% - 32px)",
        width: "calc(100% - 32px)",
        color: "white",
        borderRadius: 6,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

function GameBoard({
  roundsData,
  activeRound,
  challengerData,
  isGameLost,
  isGameWon,
  onChallenge,
  onStartOver,
  challengeLink,
  miniBoard = false,
  showLetters = true,
  wordleWord,
  emojis,
  onWordBoxSelected,
}: {
  roundsData?: Rounds | null;
  activeRound?: number;
  challengerData?: Rounds | null;
  onChallenge?: () => void;
  onStartOver?: () => void;
  isGameLost?: boolean;
  isGameWon?: boolean;
  challengeLink?: string;
  miniBoard?: boolean;
  showLetters?: boolean;
  wordleWord?: string;
  emojis?: string;
  onWordBoxSelected?: (obj: WordBoxValues) => void;
}) {
  const isChallenged = Boolean(challengerData);
  const handleWordBoxSelect = (roundRowIndex: number, wordBoxIndex: number) => {
    onWordBoxSelected?.({
      roundRowIndex,
      wordBoxIndex,
    });
  };
  const windowWidth = window.innerWidth > 375 ? 375 : window.innerWidth;
  const marginToAccount = 5 * 2;
  const boxMargins = 2.5;
  const boxWidths = (windowWidth - (marginToAccount + boxMargins * 2)) / 5;
  return (
    <div
      style={{
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
        maxWidth: miniBoard ? 160 : 365,
        margin: "auto",
        marginTop: miniBoard ? 0 : 20,
      }}
    >
      {!miniBoard && (
        <div
          style={{
            position: "absolute",
            top: -24,
            left: 0,
            cursor: "pointer",
          }}
        >
          <svg
            fill={black}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
          >
            <path d="M 10.490234 2 C 10.011234 2 9.6017656 2.3385938 9.5097656 2.8085938 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 5.2851562 5.2480469 C 4.8321563 5.0920469 4.33375 5.2793594 4.09375 5.6933594 L 2.5859375 8.3066406 C 2.3469375 8.7216406 2.4339219 9.2485 2.7949219 9.5625 L 4.1132812 10.708984 C 4.0447181 11.130337 4 11.559284 4 12 C 4 12.440716 4.0447181 12.869663 4.1132812 13.291016 L 2.7949219 14.4375 C 2.4339219 14.7515 2.3469375 15.278359 2.5859375 15.693359 L 4.09375 18.306641 C 4.33275 18.721641 4.8321562 18.908906 5.2851562 18.753906 L 6.9296875 18.1875 C 7.5958842 18.734206 8.3553934 19.166339 9.1757812 19.476562 L 9.5097656 21.191406 C 9.6017656 21.661406 10.011234 22 10.490234 22 L 13.509766 22 C 13.988766 22 14.398234 21.661406 14.490234 21.191406 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 18.714844 18.751953 C 19.167844 18.907953 19.66625 18.721641 19.90625 18.306641 L 21.414062 15.691406 C 21.653063 15.276406 21.566078 14.7515 21.205078 14.4375 L 19.886719 13.291016 C 19.955282 12.869663 20 12.440716 20 12 C 20 11.559284 19.955282 11.130337 19.886719 10.708984 L 21.205078 9.5625 C 21.566078 9.2485 21.653063 8.7216406 21.414062 8.3066406 L 19.90625 5.6933594 C 19.66725 5.2783594 19.167844 5.0910937 18.714844 5.2460938 L 17.070312 5.8125 C 16.404116 5.2657937 15.644607 4.8336609 14.824219 4.5234375 L 14.490234 2.8085938 C 14.398234 2.3385937 13.988766 2 13.509766 2 L 10.490234 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z" />
          </svg>
        </div>
      )}
      {(isGameLost || isGameWon) && (
        <MiniModal>
          <CompletedModalContent
            roundsData={roundsData}
            challengerData={challengerData}
            isGameWon={isGameWon}
            isChallenged={isChallenged}
            wordleWord={wordleWord}
            challengeLink={challengeLink}
            onChallenge={onChallenge}
            onStartOver={onStartOver}
            isGameLost={isGameLost}
            emojis={emojis}
          />
        </MiniModal>
      )}
      {roundsData?.map((row, roundRowIndex) => (
        <div key={roundRowIndex} style={{ display: "flex" }}>
          {row.map((letterData, i) => (
            <WordleBox
              key={i}
              onSelect={() => {
                if (activeRound === roundRowIndex) {
                  handleWordBoxSelect(roundRowIndex, i);
                }
              }}
              pointer={roundRowIndex === activeRound}
              selected={letterData.status === "selected"}
              letter={letterData.letter}
              status={letterData.status}
              showLetters={showLetters}
              miniBoard={miniBoard}
              width={boxWidths}
              margin={boxMargins}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
