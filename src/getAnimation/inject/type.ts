import { Spring } from "src/props/types";

export type InjectGetSpring = (
  frame: number[] | number[][],
  config?: Spring
) => Promise<(number[] | number[][])[]>;
