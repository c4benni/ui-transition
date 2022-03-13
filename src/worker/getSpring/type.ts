import { Spring } from "../../props/types";

export type GetSpring = (
  frame: number[] | number[][],
  config?: Spring
) => Promise<number[] | number[][]>;
