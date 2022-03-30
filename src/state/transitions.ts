import { DynamicObject } from "../types";
import { ConstructAnim } from "./types";

let transitions = {
  fade: (from: number = 0, to: number = 1) => {
    return {
      frame: (step, phase) => {
        const build = {
          enter: {
            opacity: `${step(from, to)}`,
            willChange: "opacity",
          },
          leave: {
            opacity: `${step(to, from)}`,
            willChange: "opacity",
          },
        };

        return build[phase];
      },
    };
  },
} as DynamicObject<ConstructAnim>;

export default transitions;

export function addUiTransition(name: string, transition: ConstructAnim) {
  transitions[name] = transition;
}

export function removeUiTransition(name: string) {
  delete transitions[name];
}
