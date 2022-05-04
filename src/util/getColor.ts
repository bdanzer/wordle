import { statuses } from "../@types";

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
