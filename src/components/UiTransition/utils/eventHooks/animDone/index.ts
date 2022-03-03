import { capitalize, Ref, RendererElement } from "vue";
import { globalState } from "../../../state";
import { AnimPhase, Emit } from "../../../types";
import { Hook, UiTransitionElement } from "../types";
import { $emit, getState, setAnimState } from "../utils";

export default function animDone(
  e: RendererElement,
  hook: Hook,
  emit: Emit,
  animPhase: Ref<AnimPhase>
) {
  const state = getState(hook);

  const { waapi } = globalState;

  setAnimState(state, animPhase);

  $emit(emit, `after${capitalize(hook)}`, [e]);

  if (!waapi) {
    const el = e as unknown as UiTransitionElement;

    el.classList.remove("ui-transition");

    ["--uit-anim-duration", "--uit-anim-name", "--uit-delay"].forEach(
      (prop) => {
        el.style.removeProperty(prop);
      }
    );
  }
}
