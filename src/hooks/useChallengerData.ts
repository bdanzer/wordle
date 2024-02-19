import { useLocation } from "react-router";
import { Rounds } from "../@types";

export function useChallengerData() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const challengerStringData = searchParams.get("challengerGameData");
  const challengerGameData = challengerStringData
    ? (JSON.parse(challengerStringData) as Rounds)
    : null;

  return { challengerGameData };
}
