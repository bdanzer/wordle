import { WritableDraft } from "immer/dist/internal";
import { flattenDeep } from "lodash";
import { GuessPattern, statuses } from "../@types";
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

export const getRandomWord = (override?: string | null, index?: number | null) =>
  override || wordleList[index || Math.floor(Math.random() * wordleList.length - 1)];

export const keyboardLetters = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

export const acceptedInputs = flattenDeep(keyboardLetters);

export const homeUrl = process.env.NODE_ENV === "production" ? "/wordle/" : "/";

// Wordle letter tile background colors
const COLOR_CORRECT_SPOT  = "green";
const COLOR_WRONG_SPOT    = "yellow";
const COLOR_NOT_ANY_SPOT  = "wrong";

// guessColor returns the guess[index] letter tile background color.
// 
// Wordle tile coloring rules: 
// Each guess must be a valid five-letter word. 
// Hit the enter button to submit. 
// After each guess, the color of the tiles will change.
// Green:   The letter is in the word and in the correct spot.   
// Yellow:  The letter is in the word but in the wrong spot.   
// Gray:    The letter is not in the word in any spot.   
export function guessColor(word: string, guess: string, index: number): statuses {
    // correct (matched) index letter
    if (guess[index] === word[index]) {
        return COLOR_CORRECT_SPOT;
    }

    let wrongWord = 0;
    let wrongGuess = 0;
    for (let i = 0; i < word.length; i++) {
        // count the wrong (unmatched) letters
        if (word[i] === guess[index] && guess[i] !== guess[index] ) {
            wrongWord++;
        }
        if (i <= index) {
            if (guess[i] === guess[index] && word[i] !== guess[index]) {
                wrongGuess++;
            }
        }

        // an unmatched guess letter is wrong if it pairs with 
        // an unmatched word letter
        if (i >= index) {
            if (wrongGuess === 0) {
                break;
            } 
            if (wrongGuess <= wrongWord) {
                return COLOR_WRONG_SPOT;
            }
        }
    }

    // otherwise not any
    return COLOR_NOT_ANY_SPOT;
}

export const handleDoubleLetters = (wordleWord: string, currentLetter: string, guessedWord: string): statuses => {
  let letterOccurancesInWordleWord = 0;
  let letterOccurancesInGuessedWord = 0;
  wordleWord.split('').forEach(wordleLetter => {
    if (wordleLetter === currentLetter) {
      letterOccurancesInWordleWord++
    }
  })

  guessedWord.split('').forEach(guessedWordLetter => {
    if (guessedWordLetter === currentLetter) {
      letterOccurancesInGuessedWord++
    }
  })

  if (letterOccurancesInWordleWord >= 2) {
    wordleWord.split('').forEach(wordleLetter => {
       
    })
  } 

  return 'yellow'
}