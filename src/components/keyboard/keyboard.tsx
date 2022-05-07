import { statuses } from "../../@types";
import { keyboardLetters } from "../../util/game";
import { black, getColor, gray, green, red } from "../../util/getColor";
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
        height: 58,
        width: 66,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 2.5,
        marginRight: -16,
        borderRadius: 6,
        backgroundColor: "white",
        // color: "white",
        fontSize: 10,
        textTransform: "uppercase",
      }}
    >
      Delete
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
        height: 58,
        maxWidth: 34,
        flex: 1,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 2.5,
        borderRadius: 6,
        transition: "0.1s ease-in",
        fontWeight: 700,
        backgroundColor,
        color: backgroundColor === "white" ? "black" : "white",
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
  const getLetterColor = (letter: string) => {
    let color: statuses = "pending";
    if (greenLetters.includes(letter)) {
      color = "green";
    } else if (yellowLetters.includes(letter)) {
      color = "yellow";
    } else if (failedLetters.includes(letter)) {
      return black;
    }

    return color === "pending" ? "white" : getColor(color);
  };

  return (
    <div style={{ maxWidth: 375, margin: "auto" }}>
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
                  backgroundColor={getLetterColor(letter)}
                />
              )
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 4 }}>
        <Button
          onClick={() => onLetterSelection("Enter")}
          backgroundColor={notAWord ? red : wordComplete ? green : gray}
        >
          {notAWord ? "Not A Word" : "Submit"}
        </Button>
      </div>
    </div>
  );
}

export default Keyboard;
