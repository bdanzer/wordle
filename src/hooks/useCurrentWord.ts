import { useContext } from "react";
import { WordleWordContext } from "../contexts";

export function useCurrentWord() {
  const wordleWordContext = useContext(WordleWordContext);

  return { ...wordleWordContext };
}
