import { ComputedRef, Ref, RendererElement } from "vue";
import { AnimPhase, BuildAnim } from "../../../types";
import { Hook, UiTransitionElement } from "../types";
import {
  getFrame,
  getState,
  resetEl,
  setAnimState,
  setProperties,
} from "../utils";

export default function animDone(
  e: RendererElement,
  hook: Hook,
  animPhase: Ref<AnimPhase>,
  configProp: ComputedRef<BuildAnim | null>,
  retainFinalStyle: boolean
) {
  const state = getState(hook);

  setAnimState(state, animPhase);

  resetEl(e);

  if (retainFinalStyle && configProp.value && animPhase.value === "enter") {
    const el = e as unknown as UiTransitionElement;

    const lastFrame = getFrame(configProp.value, animPhase.value, true) || {};

    setProperties(el, lastFrame);
  }
}
