import { SpringObject } from "../props/types";
import { AnimPhase, AnimType, Frame } from "../types";

export interface GetAnimationOutput {
  cssText: string;
  duration: number;
}

export type GetAnimation = (
  frame: Frame | Frame[],
  config: SpringObject,
  phase: AnimPhase,
  keyframeName: string,
  type: AnimType
) => Promise<GetAnimationOutput>;
