import { TransitionGroupProps, TransitionProps } from "vue";
import { Props } from "../defaults/types";
import { DurationAndDelay, Ease, Spring } from "../props/types";
import { SpringPreset } from "../state/springs/types";
import { ConstructAnim } from "../state/types";

export interface DynamicObject<T> {
  [key: string]: T;
}

export type AnimPhase = "enter" | "leave";

export type AnimPhaseObject<T> = {
  [key in AnimPhase]?: T;
};

export type Step = (
  from: number | number[],
  to: number | number[]
) => number | number[];

export type Frame = (
  step: Step,
  phase: AnimPhase
) => DynamicObject<string | number>;

export interface Anim {
  frame: Frame;
  extends?: string;
  duration?: DurationAndDelay;
  delay?: DurationAndDelay;
  ease?: Ease;
  spring?: Spring;
}

export interface BuildAnim extends Anim {
  enter?: Anim;
  leave?: Anim;
}

export type ConfigProp = BuildAnim | string | boolean;

export type Emit = (event: string, ...args: any[]) => void;

export interface InstallOptions {
  componentName?: string;
  globals?: (string | DynamicObject<string>)[];
  props?: Props;
  transitions?: DynamicObject<ConstructAnim>;
  springPreset?: SpringPreset;
}

export interface TransitionElProps
  extends TransitionGroupProps,
    TransitionProps {}
