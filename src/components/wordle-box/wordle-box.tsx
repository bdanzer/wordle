import { statuses } from "../../@types";
import { getColor } from "../../util/getColor";

function WordleBox({ letter, status }: { letter: string; status: statuses }) {
  return (
    <div
      style={{
        borderRadius: 6,
        height: 100,
        width: 100,
        fontSize: 35,
        transition: status === "pending" ? ".5s ease" : "2s ease",
        background: getColor(status),
        // border: "2px solid white",
        margin: 2,
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "uppercase"
      }}
    >
      {letter}
    </div>
  );
}

export default WordleBox;
