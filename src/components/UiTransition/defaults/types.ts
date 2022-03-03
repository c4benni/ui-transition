import { DurationAndDelay, Ease, Mode, Spring } from "../props/types";
import { ConfigProp } from "../types";

export interface Props {
  appear: boolean;
  config: ConfigProp;
  delay: DurationAndDelay;
  duration: DurationAndDelay;
  ease: Ease;
  group: boolean;
  mode: Mode;
  spring: Spring;
}
