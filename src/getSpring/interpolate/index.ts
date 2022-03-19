import { DynamicObject } from "../../types";
import { kebabCase } from "../../utils";
import { GetSpringOutput } from "../type";
import calculateSteps from "./calculateSteps";
import { Interpolate } from "./type";

const saved: DynamicObject<GetSpringOutput> = {};

// interpolate values from frames to create CSSKeyframes;
const interpolate: Interpolate = (springValues, frame, phase, keyframeName) => {
  const savePath = `${springValues}~${
    Array.isArray(frame) ? frame.join() : frame
  }~${phase}~${keyframeName}`;

  if (saved[savePath]) {
    return saved[savePath] as GetSpringOutput;
  }

  const springs: DynamicObject<string | number>[] = springValues
    .map((val) => {
      if (Array.isArray(frame)) {
        const output: DynamicObject<string | number> = {};

        frame.forEach((item) => {
          Object.assign(
            output,
            item(
              (from: number | number[], to: number | number[]) =>
                calculateSteps(from, to, val),
              phase
            )
          );
        });

        return output;
      } else {
        const output = frame(
          (from: number | number[], to: number | number[]) =>
            calculateSteps(from, to, val),
          phase
        );

        return output;
      }
    })
    .filter((x) => Object.keys(x).length);

  let cssText = "";

  let duration = 0;

  if (springs.length) {
    duration = (springs.length / 60) * 1000;

    cssText = `@keyframes ${keyframeName}{`;

    // helper to get the current frame index (keyframe %)
    const frameIndex = (length: number, index: number): number =>
      (100 / length) * index;

    for (let index = 0; index < springs.length; index++) {
      const getFrameIndex = `${frameIndex(springs.length - 1, index)}%`;

      cssText += `${getFrameIndex}{`;

      for (const key in springs[index]) {
        cssText += `${kebabCase(key)}:${springs[index][key]};`;
      }

      cssText += `}`;
    }

    cssText += "}";
  }

  return {
    cssText,
    duration,
  };
};

export default interpolate;
