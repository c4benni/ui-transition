import { capitalize, ComputedRef, Ref, RendererElement } from "vue";
import { AnimPhase, BuildAnim, Emit } from "../../../types";
import { Hook, UiTransitionElement } from "../types";
import {
  $emit,
  getState,
  resetEl,
  setAnimState,
  setProperties,
} from "../utils";

export default function animDone(
  e: RendererElement,
  hook: Hook,
  emit: Emit,
  animPhase: Ref<AnimPhase>,
  configProp: ComputedRef<BuildAnim | null>,
  retainFinalStyle: boolean
) {
  const state = getState(hook);

  setAnimState(state, animPhase);

  $emit(emit, `after${capitalize(hook)}`, [e]);

  resetEl(e);

  if (retainFinalStyle && configProp.value) {
    const el = e as unknown as UiTransitionElement;

    const lastFrame = configProp.value.frame(
      (_: number | number[], to: number | number[]) => to,
      animPhase.value
    );

    setProperties(el, lastFrame);
  }
}
