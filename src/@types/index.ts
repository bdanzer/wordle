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

export type GameTypes = "NYT" | "Random";
