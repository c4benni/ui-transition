import { ComputedRef, Ref, RendererElement } from "vue";
import { AnimPhase, BuildAnim } from "../../../types";
import { Hook, UiTransitionElement } from "../types";
import { getState, setAnimState } from "../utils";

export default function animStart(
  e: RendererElement,
  done: (cancelled?: boolean) => void,
  hook: Hook,
  animPhase: Ref<AnimPhase>,
  configProp: ComputedRef<BuildAnim | null>
) {
  const state = getState(hook);

  setAnimState(state, animPhase);

  if (!configProp.value) {
    return done();
  }

  const el = e as unknown as UiTransitionElement;

  el.__done = (cancelled?: boolean) => {
    done(cancelled);

    delete el.__done;
  };
}
