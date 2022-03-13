import { Ease } from "../../props/types";
import { AnimPhase } from "../../types";

export default function extractEase(
  propsEase: Ease,
  configEase: Ease,
  animPhase: AnimPhase
): string {
  const getValue = (priority: Ease): string | null => {
    if (typeof priority !== "undefined") {
      if (typeof priority === "string") {
        return `${priority}`;
      }

      if (typeof priority === "object") {
        const value = priority[animPhase];

        if (typeof value === "string") {
          return `${value}`;
        }
      }
    }

    return null;
  };

  const getFirstPriority = getValue(propsEase);

  if (getFirstPriority) {
    return getFirstPriority;
  }

  const getSecondPriority = getValue(configEase);

  if (getSecondPriority) {
    return getSecondPriority;
  }

  return "linear";
}
