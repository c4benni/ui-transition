import { ref } from "vue";
import { AnimConfig } from "../types/config";
import { DynamicObject } from "../types/utils";

const animations = ref<AnimConfig>({
  scale: (from = 0, to = 1) => {
    return {
      enter: {
        from: {
          transform: `scale3d({${from}},{${from}},1)`,
          opacity: "{0}",
        },
        to: {
          transform: `scale3d({${to}},{${to}},1)`,
          opacity: "{1}",
        },
      },
      leave: {
        from: {
          transform: `scale3d({${to}},{${to}},1)`,
          opacity: "{1}",
        },
        to: {
          transform: `scale3d({${from}},{${from}},1)`,
          opacity: "{0}",
        },
      },
      origin: "center",
      spring: {
        friction: 15,
        mass: 2,
        precision: 0.001,
        tension: 150,
        stopAttempt: 10,
      },
    };
  },
});

export const uiAnimations = animations;

export function addAnimConfig(arg: AnimConfig): void {
  if (typeof arg == "object" && !Array.isArray(arg)) {
    animations.value = {
      ...animations.value,
      ...arg,
    };
  }
}
