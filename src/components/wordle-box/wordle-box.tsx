import { statuses } from "../../@types";
import { black, getColor } from "../../util/getColor";

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
  inline,
  testId,
  hasChallengerMet = false,
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
  inline?: boolean;
  testId?: string;
  hasChallengerMet?: boolean;
}) {
  return (
    <div
      data-testid={testId}
      id="wordle-box"
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
        margin: miniBoard ? 1 : margin || 2,
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "uppercase",
        ...(hasChallengerMet && {
          boxShadow: `${black} 0px 0px 0px 2px inset`,
        }),
        ...(pointer && { cursor: "pointer" }),
        ...(status === "locked" && {
          boxShadow: "#229954 0px 0px 0px 4px inset",
        }),
        ...(hasPriority && { boxShadow: "#2980B9 0px 0px 0px 4px inset" }),
      }}
      onClick={() => onSelect?.()}
    >
      {showLetters ? letter : ""}
    </div>
  );
}

export default WordleBox;
