import { useLocation } from "react-router";
import { findWordIndex, homeUrl } from "../util/game";
import qs from "query-string";
import { Rounds } from "../@types";

function useChallenge() {
  const location = useLocation();
  return {
    generateChallengeLink: (roundsData: Rounds, randomWord: string) => {
      console.log("location", location);
      const wordIndex = findWordIndex(randomWord);
      const challengerGameData = JSON.stringify(roundsData);
      const stringUrl = qs.stringify({ wordIndex, challengerGameData });
      return `${document.location.origin}${homeUrl}?${stringUrl}`;
    },
  };
}

export default useChallenge;
