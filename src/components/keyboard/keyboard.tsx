import { getColor } from "../../util/getColor";

const keyboardLetters = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

function Keyboard() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap"
      }}
    >
      {keyboardLetters.map((letters) => (
        <div
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
              style={{
                height: 40,
                width: 30,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 2,
                borderRadius: 6,
                backgroundColor: getColor(""),
                color: "white"
              }}
              key={letter}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
