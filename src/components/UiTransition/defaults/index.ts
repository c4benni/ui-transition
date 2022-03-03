// Holds default configuration for props, and global options.
// The `options` object when installing this component will override these defaults.
import { Props } from "./types";

export const props: Props = {
  appear: true,
  config: "fade",
  delay: undefined,
  duration: undefined,
  ease: "linear",
  group: false,
  mode: "out-in",
  spring: "slow",
};

export const options = {
  useWorker: true,
};
