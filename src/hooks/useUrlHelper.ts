import { useLocation, useNavigate } from "react-router";
import { GameTypes } from "../@types";
import qs from "query-string";
import { urlPath } from "../util/routing";

function useUrlHelper() {
  const location = useLocation();
  const navigate = useNavigate();

  const changeGameType = (gameType: GameTypes) => {
    const Search = new URLSearchParams(location.search);

    Search.set("gameType", gameType);
    console.log("search", Search, Search.entries());
    navigate(urlPath(`?gameType=${gameType}`));
  };

  const getGameType = (): GameTypes | undefined => {
    const Search = new URLSearchParams(location.search);
    return (Search.get("gameType") as GameTypes) ?? undefined;
  };

  return { changeGameType, getGameType };
}

export default useUrlHelper;
