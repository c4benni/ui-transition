import { h, TransitionGroup as VueTransition } from "vue";
import { TransitionEl } from "../types";

const TransitionGroup: TransitionEl = function ({ slots, data }) {
  return h(VueTransition, data, {
    // TODO: add key
    default: () => slots.default?.(),
  });
};

export default TransitionGroup;
