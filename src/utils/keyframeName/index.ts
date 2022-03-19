import { SpringObject } from "../../props/types";
import { AnimPhase, BuildAnim, DynamicObject } from "../../types";

// hold parsed string that could be thousands of chars long as a key to a value of a shorter uuid
const parsedStrings: DynamicObject<string> = {};

export default function keyframeName(
  config: BuildAnim,
  spring: SpringObject,
  animPhase: AnimPhase
): string {
  const configString = JSON.stringify({
    ...config,
    frame: config.frame?.toString() || undefined,
    frames: config.frames?.map((item) => item.frame?.toString()).toString(),
  });

  const springString = JSON.stringify(spring);

  const encrypt = `${configString}-${springString}-${animPhase}`;

  if (parsedStrings[encrypt]) {
    return parsedStrings[encrypt];
  }

  return (parsedStrings[encrypt] = `uitKF-${animPhase}-${performance
    .now()
    .toString(36)
    .replace(/\./g, "-")}`);
}
