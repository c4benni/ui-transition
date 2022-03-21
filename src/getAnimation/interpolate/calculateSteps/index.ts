import { DynamicObject } from "src/types";

export const stepper = (from: number, to: number, frame: number) =>
  (from - to) * frame + to;

const saved: DynamicObject<number | number[]> = {};

export default function calculateSteps(
  from: number | number[],
  to: number | number[],
  frame: number
): number | number[] {
  const savePath = `${from}~${to}~${frame}`;

  if (saved[savePath]) {
    return saved[savePath];
  }

  const fromArray = Array.isArray(from);
  const toArray = Array.isArray(to);

  if (fromArray || toArray) {
    // check if they are same length; else bail
    if (fromArray && toArray) {
      if (from.length !== to.length) {
        return [];
      }

      const steps = [];

      for (let index = 0; index < from.length; index++) {
        steps.push(stepper(to[index], from[index], frame));
      }

      return (saved[savePath] = steps);
    }

    return [];
  } else {
    return (saved[savePath] = stepper(to, from, frame));
  }
}
