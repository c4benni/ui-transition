import { GetAnimationOutput } from "../../type";
import { DynamicObject, Frame, AnimPhase } from "../../../types";
import { kebabCase } from "../../../utils";
import calculateSteps from ".";

type SpringOnly = (
  spring: number[],
  frame: Frame | Frame[],
  phase: AnimPhase,
  keyframeName: string
) => GetAnimationOutput;

// clear this object after 3secs to avoid storing the same string stored in the style tag over again;
let saved: DynamicObject<GetAnimationOutput> = {};

const springOnly: SpringOnly = function (
  springValues,
  frame,
  phase,
  keyframeName
) {
  const savedPath = `${springValues}~${frame}~${phase}~${keyframeName}`;

  if (saved[savedPath]) {
    return saved[savedPath];
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

  saved[savedPath] = {
    cssText,
    duration,
  };

  const timeout = setTimeout(() => {
    saved = {};

    clearTimeout(timeout);
  }, 3000);

  return saved[savedPath];
};

export default springOnly;
