import { Rounds } from "../../@types";
import Button from "../Button/Button";
import WordleBox from "../wordle-box/wordle-box";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactNode, useEffect, useState } from "react";
import { black, green, pending } from "../../util/getColor";
import { useNavigate } from "react-router";
import { homeUrl } from "../../util/game";

function MiniModal({
  onChallenge,
  onStartOver,
  challengeLink,
  children,
  isGameLost,
  isChallenged,
  emojis,
}: {
  onChallenge?: () => void;
  onStartOver?: () => void;
  challengeLink?: string;
  children: ReactNode;
  isGameLost?: boolean;
  isChallenged?: boolean;
  emojis?: string;
}) {
  const [state, setState] = useState(false);
  const navigate = useNavigate();

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
      <div>
        <Button
          style={{
            marginBottom: 6,
          }}
          fullWidth
          backgroundColor={black}
          onClick={() => {
            onStartOver?.();
            navigate(homeUrl, { replace: true });
          }}
          condensed
        >
          Start New Game
        </Button>
        {!isGameLost && !isChallenged && (
          <CopyToClipboard
            text={challengeLink || ""}
            onCopy={() => setState(true)}
          >
            <Button
              condensed
              style={{
                marginBottom: 6,
              }}
              fullWidth
              backgroundColor={black}
              onClick={() => onChallenge?.()}
            >
              {state ? "Copied Game Link" : "Copy Challenge Link"}
            </Button>
          </CopyToClipboard>
        )}
        <CopyToClipboard text={emojis || ""} onCopy={() => setState(true)}>
          <Button
            condensed
            style={{
              marginBottom: 6,
            }}
            fullWidth
            backgroundColor={black}
            onClick={() => onChallenge?.()}
          >
            {state ? "Copied" : "Copy Emoji Board"}
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ height: 2, background: pending, margin: "12px 0" }}></div>
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
  wordleWord,
  emojis,
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
  wordleWord?: string;
  emojis?: string;
}) {
  const isChallenged = Boolean(challengerData);
  return (
    <div
      style={{
        // display: "flex",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
        maxWidth: miniBoard ? 160 : 365,
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
          emojis={emojis}
        >
          <div style={{ marginBottom: 6 }}>
            <span
              style={{
                color: black,
                marginBottom: 6,
                fontWeight: 700,
                fontStyle: "italic",
                display: "block",
                textTransform: "uppercase",
              }}
            >
              {wordleWord}
            </span>
            {isGameWon && (
              <span
                style={{
                  color: black,
                  display: "inline-block",
                }}
              >
                You Completed the game
              </span>
            )}
            <Divider />
            {isChallenged ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: black,
                        marginBottom: 6,
                        display: "inline-block",
                      }}
                    >
                      Your Board
                    </span>
                    <GameBoard roundsData={roundsData} miniBoard />
                  </div>
                  <div>
                    <span
                      style={{
                        color: black,
                        marginBottom: 6,
                        display: "inline-block",
                      }}
                    >
                      Their Board
                    </span>
                    <GameBoard roundsData={challengerData} miniBoard />
                  </div>
                </div>
              </div>
            ) : (
              <GameBoard roundsData={roundsData} miniBoard />
            )}
            <Divider />
          </div>
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
