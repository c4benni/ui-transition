import { ComputedRef, Ref, RendererElement } from "vue";
import { AnimPhase, BuildAnim, Emit } from "../../../types";
import sleep from "../../../worker/sleep";
import { Hook, UiTransitionElement } from "../types";
import {
  $emit,
  getState,
  setAnimState,
  setProperties,
  toggleAnimEvents,
} from "../utils";

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
    return;
  }

  const el = e as unknown as UiTransitionElement;

  el.__done = (cancelled?: boolean) => {
    done(cancelled);

    delete el.__done;
  };

  if (!waapi) {
    const eventCallback = (evt: AnimationEvent) => {
      if (
        evt.target === evt.currentTarget &&
        evt.animationName === getKeyframeName.value
      ) {
        const elem = evt.target as unknown as HTMLElement | null;

        done(evt.type === "animationcancel");

        toggleAnimEvents("remove", elem, eventCallback);
      }
    };

    toggleAnimEvents("add", el, eventCallback);

    sleep().then(() => {
      const duration = () => {
        if (typeof getDuration.value === "string" && !!getDuration.value) {
          return getDuration.value;
        }

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
