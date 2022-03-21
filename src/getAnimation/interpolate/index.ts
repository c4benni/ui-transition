import easeOnly from "./calculateSteps/easeOnly";
import springOnly from "./calculateSteps/springOnly";
import { Interpolate } from "./type";

// interpolate values from frames to create CSSKeyframes;
const interpolate: Interpolate = (spring, frame, phase, keyframeName, type) => {
  if (type === "spring") {
    return springOnly(spring, frame, phase, keyframeName);
  } else return easeOnly(frame, phase, keyframeName);
};

export default interpolate;
