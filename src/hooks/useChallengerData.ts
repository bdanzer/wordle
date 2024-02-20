import { useLocation } from "react-router";
import { Rounds } from "../@types";

function getChallengerRoundsCompleted() {}

export function useChallengerData() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const time = searchParams.get("time");
  const challengerStringData = searchParams.get("challengerGameData");
  const challengerGameData = challengerStringData
    ? (JSON.parse(challengerStringData) as Rounds)
    : null;

  console.log({ challengerGameData });

  const challengerRowCompletion = challengerGameData?.reduce(
    (prevNumber, gameDataRow) =>
      gameDataRow.some((gameData) => gameData.status !== "none")
        ? 1 + prevNumber
        : prevNumber,
    -1
  );

  return {
    challengerGameData,
    challengerRowCompletion,
    completionTime: time ? Number(time) : null,
  };
}
