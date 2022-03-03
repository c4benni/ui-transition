import { DurationAndDelay, Ease, Spring } from "../props/types";

export interface DynamicObject<T> {
  [key: string]: T;
}

export type AnimPhase = "enter" | "leave";

export type AnimPhaseObject<T> = {
  [key in AnimPhase]: T;
};

export type Step = (
  from: number | number[],
  to: number | number[]
) => number | number[];

export type Frame = (
  step: Step,
  phase: AnimPhase
) => DynamicObject<string | number>;

export type BuildAnim = {
  frame: Frame;
  extends?: string;
  duration?: DurationAndDelay;
  delay?: DurationAndDelay;
  ease?: Ease;
  spring?: Spring;
};

export type ConfigProp = BuildAnim | string | boolean;

export type Emit = (event: string, ...args: any[]) => void;
