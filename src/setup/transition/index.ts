import { h, Transition as VueTransition } from "vue";
import { TransitionEl } from "../types";

const Transition: TransitionEl = function ({ slots, data }) {
  return h(VueTransition, data, {
    default: () => slots.default?.()?.[0],
  });
};

export default Transition;
