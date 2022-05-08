import { GameTypes } from "../../@types";
import { getLocalGamesByType } from "../../util/game";
import GameBoard from "../gameboard/gameboard";

function MatchHistory({ gameType }: { gameType?: GameTypes }) {
  const localGames = getLocalGamesByType(gameType);
  console.log("Match History Game Type", gameType);
  return (
    <div>
      {localGames.map((localGame) => (
        <GameBoard
          key={localGame.id}
          roundsData={localGame.gameBoard}
          miniBoard
        />
      ))}
    </div>
  );
}

export default MatchHistory;
