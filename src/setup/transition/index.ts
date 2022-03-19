import { h, Transition as VueTransition } from "vue";
import { TransitionEl } from "../types";

const Transition: TransitionEl = function ({ slots, data, inProgress }) {
  return h(VueTransition, data, {
    default: () =>
      slots.default?.({
        inProgress: inProgress?.value,
      })?.[0],
  });
};

export default Transition;
