import { statuses } from "../@types";

export const green = "#27AE60";
export const yellow = "#F1C40F";
export const pending = "#515A5A";
export const black = "black";
export const red = "red";
export const gray = "gray";

export const getColor = (status: statuses) => {
  switch (status) {
    case "pending":
      return "#515A5A";
    case "green":
      return "#27AE60";
    case "yellow":
      return "#F1C40F";
    default:
      return "black";
  }
};
