export type statuses = "green" | "yellow" | "none" | "pending" | "wrong";
export interface GuessPattern {
  status: statuses;
  letter: string;
}
export type Rounds = Array<GuessPattern[]>;
