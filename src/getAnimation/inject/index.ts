import { DynamicObject } from "src/types";
import extractSpring from "../../utils/extractSpring";
import calcSpring from "../calcSpring";
import calculateSteps from "../interpolate/calculateSteps";
import { InjectGetSpring } from "./type";

const saved: DynamicObject<(number[] | number[][])[]> = {};

const injectGetSpring: InjectGetSpring = async (frame, config) => {
  const savePath = `${frame}~${config}`;

  if (saved[savePath]) {
    return saved[savePath];
  }

  if (Array.isArray(frame) && frame.length) {
    const springConfig = config
      ? extractSpring(config, config, "leave")
      : undefined;

    const springValues = await calcSpring(springConfig);

    // parse non 2d array frames to 2d arrays;

    // check to see if the first value isn't an array;
    const is2d = Array.isArray(frame[0]);

    // create 2d array
    const frameAs2d = is2d
      ? (frame as number[][])
      : [[frame[0] || 0, frame[1] || 0]];

    // store interpolated values. If a 2d array was passed, return 2d of springs, else return [...springs]
    const output: (number[] | number[][])[] = [];

    frameAs2d.forEach((row) => {
      const values: number[] = [];

      springValues.forEach((spring) => {
        values.push(calculateSteps(row[0], row[1], spring) as number);
      });

      if (is2d) {
        output.push([values]);
      } else {
        output.push(values);
      }
    });

    return (saved[savePath] = output);
  }

  return (saved[savePath] = []);
};

export default injectGetSpring;
