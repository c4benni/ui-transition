import getAnimation from "../../../getAnimation";
import { ComputedRef, Ref, RendererElement } from "vue";
import { SpringObject } from "../../../props/types";
import { AnimPhase, AnimType, BuildAnim } from "../../../types";
import { Hook, UiTransitionElement } from "../types";
import { getFrame, getState, setAnimState, setProperties } from "../utils";
import runAnimation from "./runAnimation";
import { GetAnimationOutput } from "../../../getAnimation/type";

export default function beforeAnimStart(
  e: RendererElement,
  hook: Hook,
  animPhase: Ref<AnimPhase>,
  configProp: ComputedRef<BuildAnim | null>,
  getKeyframeName: ComputedRef<string>,
  getDuration: ComputedRef<string>,
  getDelay: ComputedRef<string>,
  getEase: ComputedRef<string>,
  getSpring: ComputedRef<SpringObject>,
  getType: ComputedRef<AnimType>
) {
  const state = getState(hook);

  setAnimState(state, animPhase);

  const el = e as unknown as UiTransitionElement;

  if (!configProp.value) {
    return;
  }

  const delay = parseFloat(el.dataset.uitDelay || getDelay.value) || 0;

  const resetPreviousStyles = () => {
    // clear previous styles
    if (el.__previousStyles) {
      Object.assign(el.style, el.__previousStyles);

      delete el.__previousStyles;
    }
  };

  resetPreviousStyles();

  // get first frame of the transition. This value is an object.
  const firstFrame = getFrame(configProp.value, animPhase.value) || {};

  // store previous styles before setting first frame
  if (!el.__previousStyles) {
    el.__previousStyles = {};
    for (const key in firstFrame) {
      el.__previousStyles[key] = el.style.getPropertyValue(key);
    }
  }

  setProperties(el, firstFrame);

  // setup el if there's no waapi instance
  setProperties(el, {
    "--uit-delay": `${delay}ms`,
  });

  el.classList.add("ui-transition");

  const createSpring = (): Promise<GetAnimationOutput> => {
    if (!configProp.value)
      return Promise.resolve({
        cssText: "",
        duration: 0,
      });

    return getAnimation(
      configProp.value.frames?.map((x) => x.frame) || configProp.value.frame,
      getSpring.value,
      animPhase.value,
      getKeyframeName.value,
      getType.value
    );
  };

  runAnimation(
    getKeyframeName.value,
    createSpring,
    el,
    resetPreviousStyles,
    el.dataset.uitEase || getEase.value,
    getDuration.value
  );
}
