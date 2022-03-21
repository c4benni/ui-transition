import { GetAnimationOutput } from "../../type";
import { DynamicObject, Frame, AnimPhase } from "../../../types";
import { kebabCase } from "../../../utils";

type EaseOnly = (
  frame: Frame | Frame[],
  phase: AnimPhase,
  keyframeName: string
) => GetAnimationOutput;

// clear this object after 3secs to avoid storing the same string stored in the style tag over again;
let saved: DynamicObject<GetAnimationOutput> = {};

const easeOnly: EaseOnly = function (frame, phase, keyframeName) {
  const savedPath = `${frame}~${phase}~${keyframeName}`;

  if (saved[savedPath]) {
    return saved[savedPath];
  }

  let cssText = "";

  const frames = {
    from: {} as DynamicObject<string>,
    to: {} as DynamicObject<string>,
  };

  const addToCssText = (path: "from" | "to") => {
    if (!Object.keys(frames[path]).length) {
      return;
    }

    cssText += `${path}{`;

    for (const row in frames[path]) {
      cssText += `${kebabCase(row)}:${frames[path][row]};`;
    }

    cssText += "}";
  };

  const assignFrame = (frameCb: Frame, end?: boolean) =>
    Object.assign(
      frames[end ? "to" : "from"],
      frameCb((from, to) => (end ? to : from), phase)
    );

  if (Array.isArray(frame)) {
    frame.forEach((item) => {
      assignFrame(item);
      assignFrame(item, true);
    });
  } else {
    assignFrame(frame);
    assignFrame(frame, true);
  }

  addToCssText("from");
  addToCssText("to");

  saved[savedPath] = cssText
    ? {
        cssText: `@keyframes ${keyframeName}{${cssText}}`,
        duration: -1,
      }
    : {
        cssText: "",
        duration: 0,
      };

  const timeout = setTimeout(() => {
    saved = {};

    clearTimeout(timeout);
  }, 3000);

  return saved[savedPath];
};

export default easeOnly;
