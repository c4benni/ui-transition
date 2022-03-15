// Holds default configuration for props, and global options.
// The `options` object when installing this component will override these defaults.
import { Options, Props } from "./types";

export const props: Props = {
  css: false,
  appear: false,
  tag: undefined,
  enterFromClass: undefined,
  enterActiveClass: undefined,
  enterToClass: undefined,
  appearFromClass: undefined,
  appearActiveClass: undefined,
  appearToClass: undefined,
  leaveFromClass: undefined,
  leaveActiveClass: undefined,
  leaveToClass: undefined,
  config: "fade",
  delay: undefined,
  duration: undefined,
  ease: "linear",
  group: false,
  mode: "out-in",
  spring: "wobbly",
  retainFinalStyle: false,
};

export const options: Options = {
  componentName: "UiTransition",
  globals: ["sleep", "getSpring"],
};
