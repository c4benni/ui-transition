import { capitalize, Ref, RendererElement } from "vue";
import { AnimPhase, Emit } from "../../../types";
import { Hook } from "../types";
import { $emit, getState, resetEl, setAnimState } from "../utils";

export default function animDone(
  e: RendererElement,
  hook: Hook,
  emit: Emit,
  animPhase: Ref<AnimPhase>
) {
  const state = getState(hook);

  setAnimState(state, animPhase);

  $emit(emit, `after${capitalize(hook)}`, [e]);

  resetEl(e);
}
