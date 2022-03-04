import { globalState } from "../../../state";
import { DynamicObject } from "../../../types";
import { UiTransitionElement } from "../types";

export default function noWaapi(
  getKeyframeName: string,
  createSpring: () => Promise<DynamicObject<any>>,
  el: UiTransitionElement,
  resetPreviousStyles: () => void
) {
  const { styleId, keyframes } = globalState;

  if (!keyframes[getKeyframeName]) {
    createSpring().then((animObject) => {
      const {
        data: { cssText, duration },
      } = animObject;

      keyframes[getKeyframeName] = duration;

      const styleTag = document.getElementById(styleId);

      if (styleTag) {
        styleTag.innerText += cssText;
      }
    });
  }
  el.addEventListener(
    "animationstart",
    (evt) => {
      if (
        evt.target === evt.currentTarget &&
        evt.animationName === getKeyframeName
      ) {
        resetPreviousStyles();
      }
    },
    { once: true }
  );
}
