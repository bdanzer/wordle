import { statuses } from "../../@types";
import { getColor } from "../../util/getColor";

const keyboardLetters = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

function Keyboard({
  greenLetters,
  yellowLetters,
  failedLetters,
  onLetterSelection
}: {
  greenLetters: string[];
  yellowLetters: string[];
  failedLetters: string[];
  onLetterSelection: (letter: string) => void;
}) {
  const getNewColor = (letter: string) => {
    let color: statuses = "none";
    if (greenLetters.includes(letter)) {
      color = "green";
    } else if (yellowLetters.includes(letter)) {
      color = "yellow";
    } else if (failedLetters.includes(letter)) {
      return "gray";
    }

    return getColor(color);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap"
      }}
    >
      {keyboardLetters.map((letters, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "center"
            // alignItems: "center"
          }}
        >
          {letters.map((letter) => (
            <div
              onClick={() => onLetterSelection(letter)}
              key={letter}
              style={{
                height: 40,
                width: 30,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 2,
                borderRadius: 6,
                backgroundColor: getNewColor(letter),
                color: "white",
                textTransform: "uppercase"
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
      <button>Submit</button>
    </div>
  );
}

export default Keyboard;
