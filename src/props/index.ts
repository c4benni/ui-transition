import { PropType } from "vue";
import { props } from "../defaults";
import { ConfigProp } from "../types";
import { DurationAndDelay, Ease, Mode, Spring } from "./types";

export default {
  css: {
    type: Boolean,
    default: props.css,
  },

  appear: {
    type: Boolean,
    default: props.appear,
  },

  tag: {
    type: String,
    default: props.tag,
  },

  enterFromClass: {
    type: String,
    default: props.enterFromClass,
  },
  enterActiveClass: {
    type: String,
    default: props.enterActiveClass,
  },
  enterToClass: {
    type: String,
    default: props.enterToClass,
  },
  appearFromClass: {
    type: String,
    default: props.appearFromClass,
  },
  appearActiveClass: {
    type: String,
    default: props.appearActiveClass,
  },
  appearToClass: {
    type: String,
    default: props.appearToClass,
  },
  leaveFromClass: {
    type: String,
    default: props.leaveFromClass,
  },
  leaveActiveClass: {
    type: String,
    default: props.leaveActiveClass,
  },
  leaveToClass: {
    type: String,
    default: props.leaveToClass,
  },

  moveClass: {
    type: String,
    default: props.moveClass,
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

  retainFinalStyle: {
    type: Boolean,
    default: props.retainFinalStyle,
  },
};
