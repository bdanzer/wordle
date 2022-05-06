import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router";
import { Rounds } from "../../@types";
import { homeUrl } from "../../util/game";
import { black, green } from "../../util/getColor";
import Button from "../Button/Button";
import Divider from "../Divider/Divider";
import GameBoard from "./gameboard";

function CompletedModalContent({
  wordleWord,
  isGameWon,
  isChallenged,
  roundsData,
  challengerData,
  onChallenge,
  onStartOver,
  challengeLink,
  isGameLost,
  emojis,
}: {
  wordleWord?: string;
  isGameWon?: boolean;
  isChallenged?: boolean;
  roundsData?: Rounds | null;
  challengerData?: Rounds | null;
  onChallenge?: () => void;
  onStartOver?: () => void;
  challengeLink?: string;
  isGameLost?: boolean;
  emojis?: string;
}) {
  const [isChallengeLinkCopied, setChallengeLinkCopied] = useState(false);
  const [isEmojiCopied, setEmojiCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isChallengeLinkCopied) {
      setTimeout(() => setChallengeLinkCopied(false), 1500);
    }
  }, [isChallengeLinkCopied]);

  useEffect(() => {
    if (isEmojiCopied) {
      setTimeout(() => setEmojiCopied(false), 1500);
    }
  }, [isEmojiCopied]);

  return (
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
        <CopyToClipboard
          text={challengeLink || ""}
          onCopy={() => setChallengeLinkCopied(true)}
        >
          <Button
            condensed
            style={{
              marginBottom: 6,
            }}
            fullWidth
            backgroundColor={isChallengeLinkCopied ? green : black}
            onClick={() => onChallenge?.()}
          >
            {isChallengeLinkCopied
              ? "Copied Challenge Link"
              : "Copy Challenge Link"}
          </Button>
        </CopyToClipboard>
        <CopyToClipboard
          text={emojis || ""}
          onCopy={() => setEmojiCopied(true)}
        >
          <Button
            condensed
            style={{
              marginBottom: 6,
            }}
            fullWidth
            backgroundColor={isEmojiCopied ? green : black}
            onClick={() => onChallenge?.()}
          >
            {isEmojiCopied ? "Copied Emoji Board" : "Copy Emoji Board"}
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}

export default CompletedModalContent;
