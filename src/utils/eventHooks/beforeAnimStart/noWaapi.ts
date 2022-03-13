import { globalState } from "../../../state";
import { DynamicObject } from "../../../types";
import { UiTransitionElement } from "../types";
import { setProperties, toggleAnimEvents } from "../utils";

let calls = 0;

export default function noWaapi(
  getKeyframeName: string,
  createSpring: () => Promise<DynamicObject<any>>,
  el: UiTransitionElement,
  resetPreviousStyles: () => void,
  ease: string
) {
  calls += 0.0001;

  const animationId = calls;

  el.__animId = animationId;

  const { styleId, keyframes } = globalState;

  setProperties(el, {
    "--uit-ease": ease,
  });

  console.log(ease);

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
        evt.animationName === getKeyframeName &&
        el.__animId === animationId
      ) {
        resetPreviousStyles();
      }
    },
    { once: true }
  );

  const eventCallback = (evt: AnimationEvent) => {
    if (
      evt.target === evt.currentTarget &&
      evt.animationName === getKeyframeName
    ) {
      if (el.__animId === animationId) {
        resetPreviousStyles();

        el.__done?.(evt.type === "animationcancel");

        delete el.__animId;
      }
      const elem = evt.target as unknown as HTMLElement | null;

      toggleAnimEvents("remove", elem, eventCallback);
    }
  };

  toggleAnimEvents("add", el, eventCallback);
}
