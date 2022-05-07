import { GameTypes } from "../@types";
import { homeUrl } from "./game";

export const urlPath = (url: string = '') => `${homeUrl}${url}`;
