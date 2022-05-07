import { useLocation, useParams } from "react-router";
import { findWordIndex, homeUrl } from "../util/game";
import qs from "query-string";
import { Rounds } from "../@types";
import useUrlHelper from "./useUrlHelper";

function useChallenge() {
  const { getGameType } = useUrlHelper();
  return {
    generateChallengeLink: (roundsData: Rounds, randomWord: string) => {
      const wordIndex = findWordIndex(randomWord);
      const challengerGameData = JSON.stringify(roundsData);
      const stringUrl = qs.stringify({ wordIndex, challengerGameData });
      return `${
        document.location.origin
      }${homeUrl}?${stringUrl}&gameType=${getGameType()}`;
    },
  };
}

export default useChallenge;
