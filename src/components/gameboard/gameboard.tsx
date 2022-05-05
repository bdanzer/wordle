import { Rounds } from "../../@types";
import Button from "../Button/Button";
import WordleBox from "../wordle-box/wordle-box";

function GameBoard({
  roundsData,
  isGameLost,
  isGameWon,
  onChallenge
}: {
  roundsData: Rounds;
  isGameLost: boolean;
  isGameWon: boolean;
  onChallenge: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
        maxWidth: 330,
        margin: "auto"
        // alignItems: "center"
      }}
    >
      <div
        style={{
          background: "rgb(0 0 0 / 90%)",
          position: "absolute",
          height: "calc(100% - 32px)",
          width: "calc(100% - 32px)",
          color: "white",
          borderRadius: 6,
          padding: 16
        }}
      >
        <Button backgroundColor="gray">Start Over</Button>
        <Button backgroundColor="gray" onClick={onChallenge}>
          Challenge
        </Button>
        Game Over
      </div>
      {roundsData.map((guess, i) => (
        <div key={i} style={{ display: "flex" }}>
          {guess.map((hi, i) => (
            <WordleBox key={i} letter={hi.letter} status={hi.status} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
