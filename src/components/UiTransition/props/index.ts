import { PropType } from "vue";
import { props } from "../defaults";
import { ConfigProp } from "../types";
import { DurationAndDelay, Ease, Mode, Spring } from "./types";

export default {
  appear: {
    type: Boolean,
    default: props.appear,
  },

  config: {
    type: [String, Object] as PropType<ConfigProp>,
    default: props.config,
  },

  delay: {
    type: [Number, Object] as PropType<DurationAndDelay>,
    default: props.delay,
  },

  duration: {
    type: [Number, Object] as PropType<DurationAndDelay>,
    default: props.duration,
  },

  ease: {
    type: [String, Object] as PropType<Ease>,
    default: props.ease,
  },

  group: {
    type: Boolean,
    default: props.group,
  },

  mode: {
    type: String as PropType<Mode>,
    default: props.mode,
  },

  spring: {
    type: [String, Object] as PropType<Spring>,
    default: props.spring,
  },
};
