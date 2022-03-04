import { reactive } from "vue";
import { DynamicObject } from "../types";
import { ConstructAnim } from "./types";

let transitions = reactive<DynamicObject<ConstructAnim>>({
  fade: (from: number = 0, to: number = 1) => {
    return {
      frame: (step, phase) => {
        const build = {
          enter: {
            opacity: `${step(0, to)}`,
            transform: `scale3d(${step(from, to)}, ${step(from, to)}, 1)`,
          },
          leave: {
            opacity: `${step(to, from)}`,
          },
        };

        return build[phase];
      },
    };
  },
});

export default transitions;

export function addTransition(name: string, transition: ConstructAnim) {
  transitions = {
    ...transitions,
    [name]: transition,
  };
}

export function removeTransition(name: string) {
  delete transitions[name];
}
