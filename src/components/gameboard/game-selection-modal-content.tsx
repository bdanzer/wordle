import { useNavigate } from "react-router";
import { GameTypes } from "../../@types";
import useUrlHelper from "../../hooks/useUrlHelper";
import { black } from "../../util/getColor";
import { urlPath } from "../../util/routing";
import Button from "../Button/Button";

function GameSelectionModalContent({
  onGameSelection,
}: {
  onGameSelection: (gameType: GameTypes) => void;
}) {
  const { changeGameType } = useUrlHelper();

  return (
    <div>
      <h2>Game Selection</h2>
      <div>
        <Button
          onClick={() => {
            onGameSelection("NYT");
            changeGameType("NYT");
          }}
          backgroundColor={black}
          condensed
          fullWidth
          style={{ marginBottom: 6 }}
        >
          Play Official Word
        </Button>
        <Button
          onClick={() => {
            onGameSelection("Random");
            changeGameType("Random");
          }}
          backgroundColor={black}
          condensed
          fullWidth
        >
          Play Random Words
        </Button>
      </div>
    </div>
  );
}

export default GameSelectionModalContent;
