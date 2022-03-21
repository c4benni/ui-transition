import { DynamicObject } from "src/types";
import calcSpring from "./calcSpring";
import interpolate from "./interpolate";
import { GetAnimation, GetAnimationOutput } from "./type";

const saved: DynamicObject<GetAnimationOutput> = {};

// calculates spring values and returns cssText, and duration
const getSpring: GetAnimation = async function (
  frame,
  config = {},
  phase,
  keyframeName,
  type
) {
  const savePath = `${
    Array.isArray(frame) ? frame.join() : frame
  }~${JSON.stringify(config)}~${phase}~${keyframeName}`;

  if (saved[savePath]) {
    return saved[savePath];
  }

  const spring = await calcSpring(config);

  const interpolatedValues = interpolate(
    spring,
    frame,
    phase,
    keyframeName,
    type
  );

  return (saved[savePath] = interpolatedValues);
};

export default getSpring;
