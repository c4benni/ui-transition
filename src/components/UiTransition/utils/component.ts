import { ConfigDirection } from "../types/props/config";
import { GlobalState } from "../types/utils";

export function keyframeName(
  transitionConfig: ConfigDirection | null,
  spring = {
    tension: 250,
    friction: 12,
    mass: 5,
    precision: 0.001,
    stopAttempt: 10,
  }
): string {
  if (!transitionConfig) {
    return "";
  }

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

  output += `${spring.tension}-${spring.mass}-${spring.friction}-${spring.precision}-${spring.stopAttempt}`;

  return `uit-${btoa(output).replace(/=/g, "\\=")}`;
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
  const styleNode = document.createElement("style");

  globalState.styleId = `uit-${performance
    .now()
    .toString(36)
    .replace(/\./g, "-")}`;

  styleNode.id = globalState.styleId;

  styleNode.setAttribute("data-ui-transition", "");

  (document.head || document.querySelector("head")).append(styleNode);
}

export function kebabCase(arg: string): string {
  return arg.replace(/[A-Z]/g, (letter) => `-${letter}`.toLowerCase());
}
