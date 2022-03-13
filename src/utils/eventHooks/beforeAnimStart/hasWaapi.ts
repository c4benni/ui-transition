import { DynamicObject } from "../../../types";
import { UiTransitionElement } from "../types";
import { setProperties } from "../utils";

let calls = 0;

export default function hasWaapi(
  createSpring: () => Promise<DynamicObject<any>>,
  getDuration: string,
  el: UiTransitionElement,
  getEase: string,
  delay: number,
  resetPreviousStyles: () => void,
  lastFrame: DynamicObject<string | number>
) {
  calls += 0.0001;

  const animationId = calls;

  createSpring().then((animObject) => {
    const {
      data: { cssText, duration },
    } = animObject;

    const animDuration = getDuration || duration;

    const anim = el.animate(cssText, {
      duration: parseFloat(animDuration),
      easing: getEase,
      delay,
    });

    el.__animId = animationId;

    anim.addEventListener(
      "finish",
      () => {
        if (el.__animId === animationId) {
          el.__done?.();

          resetPreviousStyles();

          delete el.__animId;
        }
      },
      { once: true }
    );

    anim.addEventListener(
      "cancel",
      () => {
        if (el.__animId === animationId) {
          el.__done?.(true);

          resetPreviousStyles();

          delete el.__animId;
        }
      },
      { once: true }
    );

    if (delay) {
      requestAnimationFrame(() => {
        const timeout = setTimeout(() => {
          resetPreviousStyles();

          setProperties(el, lastFrame);

          clearTimeout(timeout);
        }, delay);
      });
    } else requestAnimationFrame(resetPreviousStyles);
  });
}
