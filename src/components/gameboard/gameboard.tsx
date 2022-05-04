import { Rounds } from "../../@types";
import WordleBox from "../wordle-box/wordle-box";

function GameBoard({ roundsData }: { roundsData: Rounds }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 16,
        position: "relative"
        // alignItems: "center"
      }}
    >
      {/* <div
        style={{
          background: "#0000002b",
          position: "absolute",
          height: "100%",
          width: "100%",
          color: "white"
        }}
      >
        Game Over
      </div> */}
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
