import { Rounds } from "../../@types";
import Button from "../Button/Button";
import WordleBox from "../wordle-box/wordle-box";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactNode, useEffect, useState } from "react";
import { black, green } from "../../util/getColor";
import { useNavigate } from "react-router";
import { homeUrl } from "../../util/game";

function MiniModal({
  onChallenge,
  onStartOver,
  challengeLink,
  children,
  isGameLost,
  isChallenged,
}: {
  onChallenge?: () => void;
  onStartOver?: () => void;
  challengeLink?: string;
  children: ReactNode;
  isGameLost?: boolean;
  isChallenged?: boolean;
}) {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (state) {
      setTimeout(() => setState(false), 2000);
    }
  }, [state]);

  return (
    <div
      style={{
        // background: "rgb(0 0 0 / 90%)",
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {!isChallenged && (
          <Button backgroundColor="gray" onClick={() => onStartOver?.()}>
            Start Over
          </Button>
        )}
        {!isGameLost && !isChallenged && (
          <CopyToClipboard
            text={challengeLink || ""}
            onCopy={() => setState(true)}
          >
            <Button backgroundColor="gray" onClick={() => onChallenge?.()}>
              {state ? "Copied Game Link" : "Challenge"}
            </Button>
          </CopyToClipboard>
        )}
      </div>
    </div>
  );
}

function GameBoard({
  roundsData,
  challengerData,
  isGameLost,
  isGameWon,
  onChallenge,
  onStartOver,
  challengeLink,
  miniBoard = false,
  showLetters = true,
}: {
  roundsData?: Rounds | null;
  challengerData?: Rounds | null;
  onChallenge?: () => void;
  onStartOver?: () => void;
  isGameLost?: boolean;
  isGameWon?: boolean;
  challengeLink?: string;
  miniBoard?: boolean;
  showLetters?: boolean;
}) {
  const navigate = useNavigate();
  const isChallenged = Boolean(challengerData);
  return (
    <div
      style={{
        // display: "flex",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
        maxWidth: miniBoard ? 160 : 330,
        margin: "auto",
        // alignItems: "center"
      }}
    >
      {(isGameLost || isGameWon) && (
        <MiniModal
          challengeLink={challengeLink}
          onChallenge={onChallenge}
          onStartOver={onStartOver}
          isGameLost={isGameLost}
          isChallenged={isChallenged}
        >
          {isGameWon && (
            <span
              style={{
                color: black,
                marginBottom: 12,
                display: "inline-block",
              }}
            >
              You Completed the game
            </span>
          )}
          {isChallenged ? (
            <>
              <span
                style={{
                  color: black,
                  marginBottom: 12,
                  display: "inline-block",
                }}
              >
                How your opponent played
              </span>
              <GameBoard roundsData={challengerData} miniBoard />
              <Button
                backgroundColor={green}
                onClick={() => {
                  navigate(homeUrl, { replace: true });
                  onStartOver?.();
                }}
              >
                Play New Game
              </Button>
            </>
          ) : (
            <GameBoard roundsData={roundsData} miniBoard />
          )}
        </MiniModal>
      )}
      {roundsData?.map((guess, i) => (
        <div key={i} style={{ display: "flex" }}>
          {guess.map((hi, i) => (
            <WordleBox
              key={i}
              letter={hi.letter}
              status={hi.status}
              showLetters={showLetters}
              miniBoard={miniBoard}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
