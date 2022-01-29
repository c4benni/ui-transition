import { ConfigDirection } from "../types/props/config";
import { GlobalState } from "../types/utils";

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

export function nextAnimFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

export function createStyleNode(globalState: GlobalState): void {
  if (!globalState.styleCreated) {
    const styleNode = document.createElement("style");

    globalState.styleId = `ui-${performance
      .now()
      .toString(36)
      .replace(/\./g, "-")}`;

    styleNode.id = globalState.styleId;

    (document.head || document.querySelector("head")).append(styleNode);

    globalState.styleCreated = true;
  }
}
