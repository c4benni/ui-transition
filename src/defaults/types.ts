import { DurationAndDelay, Ease, Mode, Spring } from "../props/types";
import { ConfigProp, DynamicObject } from "../types";

export interface Props {
  css?: boolean;
  appear?: boolean;
  enterFromClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  appearFromClass?: string;
  appearActiveClass?: string;
  appearToClass?: string;
  leaveFromClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
  moveClass?: boolean;
  config?: ConfigProp;
  delay?: DurationAndDelay;
  duration?: DurationAndDelay;
  ease?: Ease;
  group?: boolean;
  mode?: Mode;
  spring?: Spring;
  tag?: string;
}

export interface Options {
  componentName?: string;
  globals?: (string | DynamicObject<string>)[];
}
