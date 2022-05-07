import { GameType, GameTypes } from "../../@types";
import useUrlHelper from "../../hooks/useUrlHelper";
import { black } from "../../util/getColor";
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
            onGameSelection(GameType.Official);
            changeGameType(GameType.Official);
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
            onGameSelection(GameType.Random);
            changeGameType(GameType.Random);
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
