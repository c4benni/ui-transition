import { ComputedRef, Ref, RendererElement } from "vue";
import { AnimPhase, BuildAnim, Emit } from "../../../types";
import sleep from "../../../worker/sleep";
import { Hook, UiTransitionElement } from "../types";
import { $emit, getState, setAnimState, setProperties } from "../utils";

import { globalState } from "../../../state";

export default function animStart(
  e: RendererElement,
  done: (cancelled?: boolean) => void,
  hook: Hook,
  emit: Emit,
  animPhase: Ref<AnimPhase>,
  configProp: ComputedRef<BuildAnim | null>,
  getKeyframeName: ComputedRef<string>,
  getDuration: ComputedRef<string>
) {
  const { keyframes, waapi } = globalState;

  const state = getState(hook);

  setAnimState(state, animPhase);

  $emit(emit, hook, [e]);

  if (!configProp.value) {
    return done();
  }

  const el = e as unknown as UiTransitionElement;

  el.__done = (cancelled?: boolean) => {
    done(cancelled);

    delete el.__done;
  };

  if (!waapi) {
    sleep().then(() => {
      const duration = () => {
        // check dataset
        if (el.dataset.uitDuration) {
          return parseFloat(el.dataset.uitDuration);
        }

        // check the prop value
        if (typeof getDuration.value === "string" && !!getDuration.value) {
          return getDuration.value;
        }

        // check duration in config object
        if (/string|number/.test(typeof configProp.value?.duration)) {
          return parseFloat(`${configProp.value?.duration}`) || 1;
        }

        return keyframes[getKeyframeName.value];
      };

      setProperties(el, {
        "--uit-anim-duration": `${duration()}ms`,
        "--uit-anim-name": getKeyframeName.value,
      });
    });
  }
}
