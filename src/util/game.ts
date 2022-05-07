import { WritableDraft } from "immer/dist/internal";
import { flattenDeep, uniqBy } from "lodash";
import {
  GameType,
  GameTypes,
  GuessPattern,
  LocalStorageNYT,
  Rounds,
  statuses,
} from "../@types";
import wordleList from "../wordleList.json";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";

export const buildWord = (row: GuessPattern[]): string =>
  row.reduce((prevValue, currentValue) => prevValue + currentValue.letter, "");

export const findWordIndex = (word: string): number => wordleList.indexOf(word);

export const getRandomWord = (
  override?: string | null,
  index?: number | null
) =>
  override ||
  wordleList[index || Math.floor(Math.random() * wordleList.length - 1)];

export const keyboardLetters = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

export const initStatus: Rounds = [
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
  [
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
    { status: "none", letter: "" },
  ],
];

export const acceptedInputs = flattenDeep(keyboardLetters);

export const homeUrl = process.env.NODE_ENV === "production" ? "/wordle/" : "/";

// Wordle letter tile background colors
const COLOR_CORRECT_SPOT = "green";
const COLOR_WRONG_SPOT = "yellow";
const COLOR_NOT_ANY_SPOT = "wrong";

// guessColor returns the guess[index] letter tile background color.
//
// Wordle tile coloring rules:
// Each guess must be a valid five-letter word.
// Hit the enter button to submit.
// After each guess, the color of the tiles will change.
// Green:   The letter is in the word and in the correct spot.
// Yellow:  The letter is in the word but in the wrong spot.
// Wrong:    The letter is not in the word in any spot.
export function getItemStatus(
  word: string,
  guess: string,
  index: number
): statuses {
  // correct (matched) index letter
  if (guess[index] === word[index]) {
    return COLOR_CORRECT_SPOT;
  }

  let wrongWord = 0;
  let wrongGuess = 0;
  for (let i = 0; i < word.length; i++) {
    // count the wrong (unmatched) letters
    if (word[i] === guess[index] && guess[i] !== guess[index]) {
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

  return COLOR_NOT_ANY_SPOT;
}

export function deleteLetters(
  currentRoundItems: WritableDraft<GuessPattern>[]
) {
  return (status: "selected" | "pending" = "selected") => {
    let deletedSelected = false;

    for (let i = currentRoundItems.length - 1; i >= 0; i--) {
      if (currentRoundItems[i].status === status) {
        // TODO: Need to rework to pull from priority position function for a centralized spot
        currentRoundItems[i].status =
          status === "selected" && currentRoundItems[i].letter
            ? "selected"
            : "none";
        currentRoundItems[i].letter = "";
        deletedSelected = true;
        return true;
      }
    }

    // trying to delete selected letters first
    if (!deletedSelected && status === "selected") {
      deleteLetters(currentRoundItems)("pending");
    }
  };
}

export const getBoxPriorityPosition = (lettersRow: GuessPattern[]) => {
  const word = buildWord(lettersRow);
  const selectedNoLetter = lettersRow.findIndex(
    (letterData) => letterData.status === "selected" && !letterData.letter
  );
  const selectedLetter = lettersRow.findIndex(
    (letterData) => letterData.status === "selected" && letterData.letter
  );
  const noneLetter = lettersRow.findIndex(
    (letterData) => letterData.status === "none"
  );

  if (selectedNoLetter !== -1) return selectedNoLetter;
  if (selectedLetter !== -1) return selectedLetter;
  if (noneLetter !== -1 && word.length !== 5) return noneLetter;

  return -1;
};

export const getUserDate = () => {
  return DateTime.now();
};

export const getOfficialWord = () => {
  const start = DateTime.fromISO("2021-06-19");
  const diffInDays = Math.floor(
    Math.abs(start.diff(getUserDate(), "days").days)
  );
  return wordleList[diffInDays];
};

export const getLocalGame = (
  gameType: GameTypes = GameType.Official
): LocalStorageNYT | null => {
  const nytLocal =
    gameType === "NYT" ? localStorage.getItem("NYT_Games") : null;
  const existingGames: LocalStorageNYT[] = nytLocal ? JSON.parse(nytLocal) : [];

  console.log("existing", existingGames);

  return (
    existingGames.find((game) => {
      return getUserDate()
        .startOf("day")
        .equals(DateTime.fromISO(game.date).startOf("day"));
    }) || null
  );
};

export const saveGame = (
  gameId: GameTypes = GameType.Official,
  rounds: Rounds,
  word: string,
  outcome: "W" | "L"
) => {
  if (gameId === GameType.Official) {
    const nytLocal = localStorage.getItem("NYT_Games");
    const existingGames: LocalStorageNYT[] = nytLocal
      ? JSON.parse(nytLocal)
      : [];

    localStorage.setItem(
      "NYT_Games",
      JSON.stringify(
        uniqBy(
          [
            ...existingGames,
            {
              id: nanoid(),
              date: getUserDate().toFormat("yyyy-LL-dd"),
              gameBoard: rounds,
              word,
              outcome,
            },
          ],
          (games) => games.word
        )
      )
    );
  }
};
