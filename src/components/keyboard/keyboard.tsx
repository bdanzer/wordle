import { statuses } from "../../@types";
import { keyboardLetters } from "../../util/game";
import { getColor, gray, green, red } from "../../util/getColor";
import Button from "../Button/Button";

function BackSpaceKey({
  onLetterSelection,
}: {
  onLetterSelection: (letter: string) => void;
}) {
  return (
    <div
      onClick={() => onLetterSelection("Backspace")}
      style={{
        height: 50,
        width: 60,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 2,
        borderRadius: 6,
        // backgroundColor: "lightgray",
        color: "white",
        fontSize: 8,
        textTransform: "uppercase",
      }}
    >
      <svg
        version="1.1"
        id="Capa_1"
        x="0px"
        y="0px"
        viewBox="0 0 44.18 44.18"
        fill={"#515a5a"}
        // style="enable-background:new 0 0 44.18 44.18;"
      >
        <g>
          <path d="M10.625,5.09L0,22.09l10.625,17H44.18v-34H10.625z M42.18,37.09H11.734l-9.375-15l9.375-15H42.18V37.09z" />
          <polygon
            points="18.887,30.797 26.18,23.504 33.473,30.797 34.887,29.383 27.594,22.09 34.887,14.797 33.473,13.383 26.18,20.676 
		18.887,13.383 17.473,14.797 24.766,22.09 17.473,29.383 	"
          />
        </g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
      </svg>
    </div>
  );
}

function LetterKey({
  letter,
  onLetterSelection,
  backgroundColor,
}: {
  letter: string;
  onLetterSelection: (letter: string) => void;
  backgroundColor: string;
}) {
  return (
    <div
      onClick={() => onLetterSelection(letter)}
      key={letter}
      style={{
        height: 50,
        width: 32,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 2,
        borderRadius: 6,
        backgroundColor,
        color: "white",
        textTransform: "uppercase",
      }}
    >
      {letter}
    </div>
  );
}

function Keyboard({
  greenLetters,
  yellowLetters,
  failedLetters,
  onLetterSelection,
  notAWord,
  wordComplete,
}: {
  greenLetters: string[];
  yellowLetters: string[];
  failedLetters: string[];
  onLetterSelection: (letter: string) => void;
  notAWord: boolean;
  wordComplete: boolean;
}) {
  const getNewColor = (letter: string) => {
    let color: statuses = "pending";
    if (greenLetters.includes(letter)) {
      color = "green";
    } else if (yellowLetters.includes(letter)) {
      color = "yellow";
    } else if (failedLetters.includes(letter)) {
      return "black";
    }

    return getColor(color);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {keyboardLetters.map((letters, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "center",
            // alignItems: "center"
          }}
        >
          {letters.map((letter) =>
            letter === "Backspace" ? (
              <BackSpaceKey
                key={letter}
                onLetterSelection={onLetterSelection}
              />
            ) : (
              <LetterKey
                key={letter}
                letter={letter}
                onLetterSelection={onLetterSelection}
                backgroundColor={getNewColor(letter)}
              />
            )
          )}
        </div>
      ))}
      <Button
        onClick={() => onLetterSelection("Enter")}
        backgroundColor={notAWord ? red : wordComplete ? green : gray}
      >
        {notAWord ? "Not A Word" : "Submit"}
      </Button>
    </div>
  );
}

export default Keyboard;
