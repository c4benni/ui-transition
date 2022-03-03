// Vue's transition mode

import { AnimPhaseObject } from "../types";

export type Mode = "out-in" | "in-out" | undefined;

export type DurationAndDelay = number | AnimPhaseObject<number> | undefined;

export type Ease = string | AnimPhaseObject<string>;

export type SpringPath = "wobbly" | "stiff" | "default" | "gentle" | "slow";

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
