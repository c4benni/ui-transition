import { SpringObject } from "../../props/types";
import { AnimPhase, AnimType, BuildAnim, DynamicObject } from "../../types";

// hold parsed string that could be thousands of chars long as a key to a value of a shorter uuid
const parsedStrings: DynamicObject<string> = {};

export default function keyframeName(
  config: BuildAnim,
  spring: SpringObject,
  animPhase: AnimPhase,
  getType: AnimType
): string {
  const configString = JSON.stringify({
    ...config,
    frame: config.frame?.toString() || undefined,
    frames: config.frames?.map((item) => item.frame?.toString()),
  }).replace(/\s/g, "");

  const springString = getType === "spring" ? JSON.stringify(spring) : "";

  const encrypt = `${configString}~${springString}~${animPhase}`;

  if (parsedStrings[encrypt]) {
    return parsedStrings[encrypt];
  }

  return (parsedStrings[encrypt] = `uitKF-${getType}-${animPhase}-${performance
    .now()
    .toString(36)
    .replace(/\./g, "-")}`);
}
