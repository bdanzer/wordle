export type statuses =
  | "green"
  | "yellow"
  | "none"
  | "pending"
  | "wrong"
  | "selected"
  | "locked";
export interface GuessPattern {
  status: statuses;
  letter: string;
}
export type Rounds = Array<GuessPattern[]>;

export interface WordBoxValues {
  roundRowIndex: number;
  wordBoxIndex: number;
}

export enum GameType {
  Official = 'NYT',
  Random = 'Random'
}

export enum Outcome {
  W = 'W',
  L = 'L'
}

export type GameTypes = GameType;

export interface LocalStorageNYT {
  id: string;
  date: string;
  gameBoard: Rounds;
  word: string;
  outcome: Outcome
}
