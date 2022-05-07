import { useLocation, useParams } from "react-router";
import { findWordIndex, homeUrl } from "../util/game";
import qs from "query-string";
import { Rounds } from "../@types";

function useChallenge() {
  const location = useLocation();
  const params = useParams();
  return {
    generateChallengeLink: (roundsData: Rounds, randomWord: string) => {
      const wordIndex = findWordIndex(randomWord);
      const challengerGameData = JSON.stringify(roundsData);
      const stringUrl = qs.stringify({ wordIndex, challengerGameData });
      return `${document.location.origin}${homeUrl}${params.gameId}/?${stringUrl}`;
    },
  };
}

export default useChallenge;
