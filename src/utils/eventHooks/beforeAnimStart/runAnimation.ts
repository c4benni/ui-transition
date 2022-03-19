import { globalState } from "../../../state";
import { AnimPhase, DynamicObject } from "../../../types";
import { UiTransitionElement } from "../types";
import { setProperties, toggleAnimEvents } from "../utils";

let calls = 0;

export default function runAnimation(
  getKeyframeName: string,
  createSpring: () => Promise<DynamicObject<any>>,
  el: UiTransitionElement,
  resetPreviousStyles: () => void,
  ease: string,
  getDuration: string
) {
  calls += 0.0001;

  const animationId = calls;

  el.__animId = animationId;

  const { styleId, keyframes } = globalState;

  const startAnimation = () => {
    const cleanUp = () => {
      if (el.__animId === animationId) {
        resetPreviousStyles();

        el.__done?.();

        delete el.__animId;
      }
    };

    const duration = () => {
      // check dataset
      if (el.dataset.uitDuration) {
        return parseFloat(el.dataset.uitDuration);
      }

      // check the prop value
      if (typeof getDuration === "string" && !!getDuration) {
        return getDuration;
      }

      return keyframes[getKeyframeName];
    };

    requestAnimationFrame(() =>
      setProperties(el, {
        "--uit-anim-duration": `${duration()}ms`,
        "--uit-anim-name": getKeyframeName,
        "--uit-ease": ease,
      })
    );

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
        cleanUp();

        const elem = evt.target as unknown as HTMLElement | null;

        toggleAnimEvents("remove", elem, eventCallback);
      }
    };

    if (keyframes[getKeyframeName] !== "0") {
      toggleAnimEvents("add", el, eventCallback);
    } else {
      requestAnimationFrame(() => {
        cleanUp();
      });
    }
  };

  if (!keyframes[getKeyframeName]) {
    createSpring()
      .then((animObject) => {
        const { cssText, duration } = animObject;

        keyframes[getKeyframeName] = `${duration}`;

        if (cssText) {
          const styleTag = document.getElementById(styleId);

          if (styleTag) {
            styleTag.innerText += cssText;
          }
        }
      })
      .finally(startAnimation);
  } else {
    startAnimation();
  }
}
