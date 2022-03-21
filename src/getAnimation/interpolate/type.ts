import { AnimPhase, AnimType, Frame } from "../../types";
import { GetAnimationOutput } from "../type";

export type Interpolate = (
  spring: number[],
  frame: Frame | Frame[],
  phase: AnimPhase,
  keyframeName: string,
  type: AnimType
) => GetAnimationOutput;
