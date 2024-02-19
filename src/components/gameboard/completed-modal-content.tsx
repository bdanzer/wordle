import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Rounds } from "../../@types";
import { black, green } from "../../util/getColor";
import Button from "../Button/Button";
import Divider from "../Divider/Divider";
import GameBoard from "./gameboard";
import { useChallengerData } from "../../hooks/useChallengerData";

function ChallengeBoards({ roundsData }: { roundsData?: Rounds | null }) {
  const { challengerGameData } = useChallengerData();

  return (
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
          <GameBoard
            roundsData={challengerGameData}
            miniBoard
            challengerData={challengerGameData}
          />
        </div>
      </div>
    </div>
  );
}

function useCopied() {
  const [isCopied, setCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setCopied(false), 1500);
    }
  }, [isCopied]);

  return { isCopied, setCopied };
}

function ModalHeader({
  wordleWord,
  isGameWon,
}: {
  wordleWord?: string;
  isGameWon?: boolean;
}) {
  return (
    <>
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
    </>
  );
}

function CompletedModalContent({
  wordleWord,
  isGameWon,
  isChallenged,
  roundsData,
  challengerData,
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
  onStartOver?: () => void;
  challengeLink?: string;
  isGameLost?: boolean;
  emojis?: string;
}) {
  const { isCopied: isChallengeLinkCopied, setCopied: setChallengeLinkCopied } =
    useCopied();
  const { isCopied: isEmojiCopied, setCopied: setEmojiCopied } = useCopied();

  return (
    <div style={{ marginBottom: 6 }}>
      <ModalHeader wordleWord={wordleWord} isGameWon={isGameWon} />
      <Divider />
      {isChallenged ? (
        <ChallengeBoards roundsData={roundsData} />
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
          >
            {isEmojiCopied ? "Copied Emoji Board" : "Copy Emoji Board"}
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}

export default CompletedModalContent;
