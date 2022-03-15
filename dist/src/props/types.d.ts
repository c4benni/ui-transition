import transitions from "../state/transitions";
import { AnimPhaseObject } from "../types";
export declare type Mode = "out-in" | "in-out" | undefined;
export declare type DurationAndDelay = number | AnimPhaseObject<number> | undefined;
export declare type Ease = string | AnimPhaseObject<string>;
export declare type SpringPath = "wobbly" | "stiff" | "default" | "gentle" | "slow" | keyof typeof transitions;
export declare type SpringObject = {
    tension?: number;
    friction?: number;
    mass?: number;
    precision?: number;
    velocity?: number;
    stopAttempt?: number;
};
declare type SpringRoot = SpringPath | SpringObject;
export declare type Spring = SpringRoot | AnimPhaseObject<SpringRoot>;
export {};
