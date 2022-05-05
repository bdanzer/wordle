import { WritableDraft } from "immer/dist/internal";
import { flattenDeep } from "lodash";
import { GuessPattern } from "../@types";
import wordleList from "../wordleList.json";

// const check = (
//   currentRoundItems: WritableDraft<GuessPattern>[],
//   wordleWord
// ) => {
//   return currentRoundItems.forEach((item, i) => {
//     console.log(wordleWord[i], e.key);
//     const indexOfLetter = randomWordleWord.indexOf(item.letter);

//     if (wordleWord[i] === currentRoundItems[i].letter) {
//       console.log("got it right", item.letter);
//       winChecker++;
//       item.status = "green";
//     } else if (indexOfLetter !== -1) {
//       item.status = "yellow";
//     } else {
//       item.status = "wrong";
//     }
//   });
// };

export const buildWord = (row: GuessPattern[]) =>
  row.reduce((prevValue, currentValue) => prevValue + currentValue.letter, "");

export const findWordIndex = (word: string): number => wordleList.indexOf(word);

export const getRandomWord = (override?: string) =>
  override || wordleList[Math.floor(Math.random() * wordleList.length - 1)];

export const keyboardLetters = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

export const acceptedInputs = flattenDeep(keyboardLetters);

export const homeUrl = process.env.NODE_ENV === "production" ? "/wordle/" : "/";
