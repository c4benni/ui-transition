import { BuildAnim, DynamicObject } from "../types";

export interface GlobalState {
  styleId: string;
  styleCreated: boolean;
  webWorker: null | Worker;
  waapi: boolean;
  init: boolean;
  keyframes: DynamicObject<number>;
}

export type ConstructAnim = (...args: any[]) => BuildAnim;
