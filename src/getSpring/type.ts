import { SpringObject } from "src/props/types";
import { AnimPhase, Frame } from "src/types";

export interface GetSpringOutput {
  cssText: string;
  duration: number;
}

export type GetSpring = (
  frame: Frame | Frame[],
  config: SpringObject,
  phase: AnimPhase,
  keyframeName: string
) => Promise<GetSpringOutput>;
