import { AnimPhase, Frame } from "src/types";
import { GetSpringOutput } from "../type";

export type Interpolate = (
  spring: number[],
  frame: Frame | Frame[],
  phase: AnimPhase,
  keyframeName: string
) => GetSpringOutput;
