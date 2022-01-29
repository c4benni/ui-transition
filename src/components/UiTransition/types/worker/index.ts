import { ConfigDirection } from "../props/config";
import { DynamicObject } from "../utils";

export interface CreateSpring {
  stiffness?: number;
  damping?: number;
  mass?: number;
  precision?: number;
  stopAttempt?: number;
}

export type AsyncWorker = (arg: {
  type: "spring" | "ease" | "sleep";
  parse?: boolean;
  data?: DynamicObject<any>;
}) => Promise<DynamicObject<any>>;

export interface Mustache {
  value: string;
  unit?: string;
}

export type GetMustache = () => {
  from: Mustache[];
  to: Mustache[];
  originalTo: string;
} | null;

export type MatchAndReplace = (original: string, array: string[]) => string;

export type Interpolate = (spring: number[]) => string[];

export interface Keyframes {
  [frame: string]: {
    opacity?: string;
    transform?: string;
  };
}

export type ParseKeyFrames = (
  Transform: string[] | null,
  opacity: string[] | null
) => string | null;

export type GetCSS = {
  keyframes: string;
  animName: string;
} | null;

export interface MessageData extends ConfigDirection {
  savePath: string;
  keyframeName: string;
}
