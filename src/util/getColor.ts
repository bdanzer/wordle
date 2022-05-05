import { statuses } from "../@types";

export const green = "#27AE60";
export const yellow = "#F1C40F";
export const pending = "#515A5A";
export const black = "black";
export const red = "#C0392B";
export const gray = "#5D6D7E";

export const getColor = (status: statuses) => {
  switch (status) {
    case "pending":
      return "#515A5A";
    case "green":
      return "#27AE60";
    case "yellow":
      return "#F1C40F";
    case "none":
      return '#979A9A';
    default:
      return "black";
  }
};
