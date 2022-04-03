import beforeMount from "../../../setup/hooks/beforeMount";
import { GetAnimationOutput } from "../../../getAnimation/type";
import { globalState } from "../../../state";
import { UiTransitionElement } from "../types";
import { setProperties, toggleAnimEvents } from "../utils";

let calls = 0;

export default function runAnimation(
  getKeyframeName: string,
  createSpring: () => Promise<GetAnimationOutput>,
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

    if (keyframes[getKeyframeName] !== "0") {
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

      toggleAnimEvents("add", el, eventCallback);

      setProperties(el, {
        "--uit-anim-duration": `${duration()}ms`,
        "--uit-anim-name": getKeyframeName,
        "--uit-ease": ease,
      });
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
          const addNewStyles = () => {
            const styleEl = document.getElementById(
              styleId
            ) as HTMLStyleElement;

            if (styleEl) {
              styleEl.innerText += cssText;
            } else {
              // something awefully wrong happened; refresh!
              beforeMount(true);

              addNewStyles();
            }
          };

          addNewStyles();
        }
      })
      .finally(startAnimation);
  } else {
    startAnimation();
  }
}
