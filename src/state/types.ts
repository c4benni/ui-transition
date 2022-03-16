import { BuildAnim, DynamicObject } from "../types";

export interface GlobalState {
  styleId: string;
  styleCreated: boolean;
  webWorker: null | Worker;
  init: boolean;
  keyframes: DynamicObject<number | string>;
}

export type ConstructAnim = (...args: any[]) => BuildAnim;
