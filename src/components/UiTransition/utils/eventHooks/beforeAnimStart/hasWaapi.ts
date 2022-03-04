import { DynamicObject } from "../../../types";
import { UiTransitionElement } from "../types";

export default function hasWaapi(
  createSpring: () => Promise<DynamicObject<any>>,
  getDuration: string,
  el: UiTransitionElement,
  getEase: string,
  delay: number,
  resetPreviousStyles: () => void
) {
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

    anim.addEventListener(
      "finish",
      () => {
        el.__done?.();

        resetPreviousStyles();
      },
      { once: true }
    );

    anim.addEventListener(
      "cancel",
      () => {
        el.__done?.(true);

        resetPreviousStyles();
      },
      { once: true }
    );

    if (delay) {
      const timeout = setTimeout(() => {
        resetPreviousStyles();

        clearTimeout(timeout);
      }, delay);
    } else resetPreviousStyles();
  });
}
