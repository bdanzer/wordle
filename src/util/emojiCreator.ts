import { Rounds, statuses } from "../@types";

export const getEmojiByStatus = (status: statuses) => {
  switch (status) {
    case "yellow":
      return "🟨";
    case "green":
      return "🟩";
    default:
      return "️️️️️️️️⬛️";
  }
};

export const emojiCreation = (roundsData: Rounds) => {
  let str = "";
  roundsData.forEach((roundsData) => {
    roundsData.forEach((guess) => {
      str += `${getEmojiByStatus(guess.status)}`;
    });
    str += "\n";
  });
  console.log("str", str);
  return str;
};
