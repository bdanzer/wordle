import { statuses } from "../../@types";
import { getColor, selectedColor } from "../../util/getColor";

function WordleBox({
  letter,
  status,
  miniBoard,
  showLetters = true,
  onSelect,
  selected,
  pointer = false,
  width,
  margin,
  hasPriority,
}: {
  letter: string;
  status: statuses;
  miniBoard?: boolean;
  showLetters?: boolean;
  onSelect?: () => void;
  selected?: boolean;
  pointer?: boolean;
  width?: number;
  margin?: number;
  hasPriority?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: miniBoard ? 4 : 6,
        height: miniBoard ? 30 : width || 69,
        width: miniBoard ? 30 : width || 69,
        fontSize: miniBoard ? 12 : 35,
        transition:
          status === "none"
            ? "0.1s ease"
            : selected || hasPriority
            ? ".25s ease"
            : status === "pending"
            ? ".5s ease"
            : "2s ease",
        background: getColor(status),
        // border: "2px solid white",
        margin: miniBoard ? 1 : margin || 2,
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "uppercase",
        ...(pointer && { cursor: "pointer" }),
        // ...(hasPriority && { boxShadow: "inset 0 -2px 0 red" }),
        ...(hasPriority && { boxShadow: "#2980B9 0px 0px 0px 4px inset" }),
      }}
      onClick={() => onSelect?.()}
    >
      {showLetters ? letter : ""}
    </div>
  );
}

export default WordleBox;
