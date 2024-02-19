import { ReactNode, useState } from "react";
import { WordleWordContext } from ".";
import { getOfficialWord, getRandomWord } from "../util/game";
import { useLocation } from "react-router";

export function WordleProvider({ children }: { children: ReactNode }) {
  const [currentWordleWord, setCurrentWord] = useState<string>("");
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  console.log({ searchParams: searchParams.toString() });

  const wordIndex = searchParams.get("wordIndex")
    ? parseInt(searchParams.get("wordIndex") ?? "")
    : null;

  const randomWordleWord = getRandomWord(null, wordIndex);
  const officialWord = getOfficialWord(wordIndex);

  const [randomWord, setRandomWordleWord] = useState(randomWordleWord);

  const generateNewWord = (wordIndex?: null | number) => {
    setRandomWordleWord(getRandomWord(null, wordIndex));
  };

  console.log({ officialWord, randomWordleWord, wordIndex });

  return (
    <WordleWordContext.Provider
      value={{
        officialWord,
        randomWord,
        currentWordleWord,
        wordIndex,
        setCurrentWord,
        generateNewWord,
      }}
    >
      {children}
    </WordleWordContext.Provider>
  );
}
