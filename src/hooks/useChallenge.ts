import { findWordIndex, homeUrl } from "../util/game";
import qs from "query-string";
import { GameType, Rounds } from "../@types";
import useUrlHelper from "./useUrlHelper";

function useChallenge() {
  const { getGameType } = useUrlHelper();
  return {
    generateChallengeLink: (roundsData: Rounds, randomWord: string) => {
      const wordIndex = findWordIndex(randomWord);
      const challengerGameData = JSON.stringify(roundsData);
      const stringUrl = qs.stringify({ wordIndex, challengerGameData });
      const gameType = getGameType();
      const preText = `${
        gameType === GameType.Official
          ? `Offical Word Challenge - Word ${wordIndex} \n\n`
          : `Random Word Challenge - Word ${wordIndex} \n\n`
      }`;
      // return `${preText}${document.location.origin}${homeUrl}?${stringUrl}&gameType=${gameType}`;

      return `https://bdanzer.github.io/wordle/?${stringUrl}&gameType=${gameType}`;
    },
  };
}

export default useChallenge;
