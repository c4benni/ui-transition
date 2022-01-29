import { PropType } from "vue";
import { ConfigProp } from "./types/props/config";
import defaults from "./utils/defaults";

export default {
  config: {
    type: [Boolean, String, Object, Array] as PropType<ConfigProp>,
    default: defaults.config,
  },
  group: {
    type: Boolean,
    default: defaults.group,
  },
  optimize: {
    type: Boolean,
    default: defaults.optimise,
  },
  previousTransform: {
    type: String,
    default: defaults.previousTransform,
  },
};
