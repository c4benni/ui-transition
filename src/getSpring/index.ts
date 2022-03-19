import { DynamicObject } from "src/types";
import calcSpring from "./calcSpring";
import interpolate from "./interpolate";
import { GetSpring, GetSpringOutput } from "./type";

const saved: DynamicObject<GetSpringOutput> = {};

// calculates spring values and returns cssText, and duration
const getSpring: GetSpring = async function (
  frame,
  config = {},
  phase,
  keyframeName
) {
  const savePath = `${
    Array.isArray(frame) ? frame.join() : frame
  }~${JSON.stringify(config)}~${phase}~${keyframeName}`;

  if (saved[savePath]) {
    return saved[savePath];
  }

  const spring = await calcSpring(config);

  const interpolatedValues = interpolate(spring, frame, phase, keyframeName);

  return (saved[savePath] = interpolatedValues);
};

export default getSpring;
