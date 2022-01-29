export type DynamicObject<T> = {
  [key: string]: T;
};

export type Progress = (from: number, to: number, ratio: number) => number;

export interface GlobalState {
  styleId: string;
  styleCreated: boolean;
  workerCreated: boolean;
}