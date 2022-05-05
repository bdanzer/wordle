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
        backgroundColor: "lightgray",
        color: "white",
        fontSize: 8,
        textTransform: "uppercase",
      }}
    >
      {"Delete"}
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
    let color: statuses = "none";
    if (greenLetters.includes(letter)) {
      color = "green";
    } else if (yellowLetters.includes(letter)) {
      color = "yellow";
    } else if (failedLetters.includes(letter)) {
      return "black";
    }

    return gray;

    // return getColor(color);
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
