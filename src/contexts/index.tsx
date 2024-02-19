import { Dispatch, SetStateAction, createContext } from "react";

export const WordleWordContext = createContext<{
  currentWordleWord: string;
  officialWord: string;
  randomWord: string;
  wordIndex: number | null;
  setCurrentWord: Dispatch<SetStateAction<string>>;
  generateNewWord: (index?: null | number) => void;
}>({
  officialWord: "",
  currentWordleWord: "",
  randomWord: "",
  wordIndex: null,
  setCurrentWord: () => {},
  generateNewWord: () => {},
});
