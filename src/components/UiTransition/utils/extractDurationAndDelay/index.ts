import { DurationAndDelay } from "../../props/types";
import { AnimPhase } from "../../types";

export default function extractDurationAndDelay(
  firstPriority: DurationAndDelay,
  secondPriority: DurationAndDelay,
  animPhase: AnimPhase
): string {
  const getValue = (priority: DurationAndDelay): string | null => {
    if (typeof priority !== "undefined") {
      if (typeof priority === "number") {
        return `${priority}`;
      }

      if (typeof priority === "object") {
        const value = priority[animPhase];

        if (typeof value === "number") {
          return `${value}`;
        }
      }
    }

    return null;
  };

  const getFirstPriority = getValue(firstPriority);

  if (getFirstPriority) {
    return getFirstPriority;
  }

  const getSecondPriority = getValue(secondPriority);

  if (getSecondPriority) {
    return getSecondPriority;
  }

  return "";
}
