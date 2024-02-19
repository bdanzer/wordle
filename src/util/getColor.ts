import { statuses } from "../@types";

export const green = "#27AE60";
export const yellow = "#F4D03F";
// export const pending = "#808B96";
export const pending = "#7DCEA0";
export const black = "#34495E";
export const red = "#C0392B";
export const gray = "#5D6D7E";
export const none = "#ABB2B9";
export const selectedColor = "#5499C7";

export const getColor = (status: statuses) => {
  switch (status) {
    case "pending":
      return pending;
    case "locked":
    case "green":
      return green;
    case "yellow":
      return yellow;
    case "none":
      return none;
    case "selected":
      return selectedColor;
    default:
      return black;
  }
};
