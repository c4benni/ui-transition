import { Spring, SpringObject } from "../../props/types";
import springPreset from "../../state/springs";
import { AnimPhase } from "../../types";

export default function extractSpring(
  propsEase: Spring,
  configEase: Spring | undefined,
  animPhase: AnimPhase
): SpringObject {
  const getValue = (priority: Spring | undefined): SpringObject | null => {
    if (typeof priority !== "undefined") {
      if (typeof priority === "string") {
        return springPreset[priority.toLowerCase()] || null;
      }

      if (typeof priority === "object") {
        //   @ts-ignore
        //   same as priority.enter
        const value = priority[animPhase];

        if (value) {
          if (typeof value === "string") {
            //   @ts-ignore
            return springPreset[value.toLowerCase()] || null;
          }

          if (typeof value === "object") {
            return value;
          }
        }
        //   @ts-ignore
        else return priority;
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

  return springPreset.default;
}
