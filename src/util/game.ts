import { WritableDraft } from "immer/dist/internal";
import { GuessPattern } from "../@types";

const check = (
  currentRoundItems: WritableDraft<GuessPattern>[],
  wordleWord
) => {
  return currentRoundItems.forEach((item, i) => {
    console.log(wordleWord[i], e.key);
    const indexOfLetter = randomWordleWord.indexOf(item.letter);

    if (wordleWord[i] === currentRoundItems[i].letter) {
      console.log("got it right", item.letter);
      winChecker++;
      item.status = "green";
    } else if (indexOfLetter !== -1) {
      item.status = "yellow";
    } else {
      item.status = "wrong";
    }
  });
};
