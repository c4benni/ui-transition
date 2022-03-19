import transitions from "../state/transitions";
import { AnimPhaseObject } from "../types";

export type Mode = "default" | "out-in" | "in-out" | undefined;

export type DurationAndDelay = number | AnimPhaseObject<number> | undefined;

export type Ease = string | AnimPhaseObject<string>;

export type SpringPath =
  | "wobbly"
  | "stiff"
  | "default"
  | "gentle"
  | "slow"
  | keyof typeof transitions;

export type SpringObject = {
  tension?: number;
  friction?: number;
  mass?: number;
  precision?: number;
  velocity?: number;
  stopAttempt?: number;
};

type SpringRoot = SpringPath | SpringObject;

export type Spring = SpringRoot | AnimPhaseObject<SpringRoot>;
