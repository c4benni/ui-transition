export type DynamicObject<T> = {
  [key: string]: T;
};

export type Progress = (from: number, to: number, ratio: number) => number;

export interface GlobalState {
  styleId: string;
  styleCreated: boolean;
  workerCreated: boolean;
}

export type AnimState = "enter" | "leave";

export type AnimEvent =
  | AnimState
  | "appear"
  | "beforeEnter"
  | "beforeLeave"
  | "beforeAppear"
  | "afterEnter"
  | "afterLeave"
  | "afterAppear"
  | "appearCancelled"
  | "enterCancelled"
  | "leaveCancelled";