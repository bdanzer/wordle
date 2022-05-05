import { statuses } from "../../@types";
import { getColor } from "../../util/getColor";

function WordleBox({
  letter,
  status,
  miniBoard,
  showLetters = true,
}: {
  letter: string;
  status: statuses;
  miniBoard?: boolean;
  showLetters?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: miniBoard ? 4 : 6,
        height: miniBoard ? 30 : 62,
        width: miniBoard ? 30 : 62,
        fontSize: miniBoard ? 12 : 35,
        transition: status === "pending" ? ".5s ease" : "2s ease",
        background: getColor(status),
        // border: "2px solid white",
        margin: miniBoard ? 1 : 2,
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "uppercase",
      }}
    >
      {showLetters ? letter : ""}
    </div>
  );
}

export default WordleBox;
