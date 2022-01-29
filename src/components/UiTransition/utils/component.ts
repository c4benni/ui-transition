import { ConfigDirection } from "../types/props/config";

export function keyframeName(
  transitionConfig: ConfigDirection,
  spring = {
    stiffness: 250,
    damping: 12,
    mass: 5,
    precision: 0.001,
    stopAttempt: 10,
  }
): string {
  const { from, to } = transitionConfig;

  let output = "";

  if (from?.opacity) {
    output += `of-${from.opacity}-`;
  }
  if (to?.opacity) {
    output += `ot-${to.opacity}-`;
  }

  if (from?.transform) {
    output += `tf-${from.transform}-`;
  }
  if (to?.opacity) {
    output += `tt-${to.transform}-`;
  }

  output += `${spring.stiffness}-${spring.mass}-${spring.damping}-${spring.precision}-${spring.stopAttempt}`;

  return `uit-${btoa(output).replace(/=/g, "/=")}`;
}

export function getAnimSavePath(transitionConfig: ConfigDirection) {
  const { from, to } = transitionConfig;

  return [
    from?.opacity || "",
    to?.opacity || "",
    from?.transform || "",
    to?.transform || "",
  ]
    .join("")
    .replace(/\s+/g, "~");
}

export function sleep(duration: number): Promise<number> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(duration);

      clearTimeout(timeout);
    }, duration);
  });
}
