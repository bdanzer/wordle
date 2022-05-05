import { statuses } from "../@types";

export const green = "#27AE60";
export const yellow = "#F1C40F";
export const pending = "#515A5A";
export const black = "black";
export const red = "#C0392B";
export const gray = "#808B96";

export const getColor = (status: statuses) => {
  switch (status) {
    case "pending":
      return "#515A5A";
    case "green":
      return "#27AE60";
    case "yellow":
      return "#F1C40F";
    case "none":
      return 'lightgray';
    default:
      return "black";
  }
};
