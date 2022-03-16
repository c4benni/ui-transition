import { ComputedRef, Ref, RendererElement } from "vue";
import { SpringObject } from "../../../props/types";
import {
  AnimPhase,
  BuildAnim,
  ConfigProp,
  DynamicObject,
} from "../../../types";
import asyncWorker from "../../../worker/asyncWorker";
import { Hook, UiTransitionElement } from "../types";
import { getState, setAnimState, setProperties } from "../utils";
import runAnimation from "./runAnimation";

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
  propsConfig: ConfigProp
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
  const firstFrame = configProp.value.frame(
    (from: number | number[], _) => from,
    animPhase.value
  );

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

  const createSpring = async (): Promise<DynamicObject<any>> => {
    if (!configProp.value) return Promise.resolve({});

    // make frame() to be a string
    const buildAnim = () => {
      if (
        typeof propsConfig === "object" &&
        typeof propsConfig.frame === "function"
      ) {
        return {
          ...propsConfig,
          frame: propsConfig.frame.toString(),
        };
      }

      return propsConfig;
    };

    return asyncWorker({
      type: "spring",
      data: {
        buildAnim: buildAnim(),
        // TODO:  savePath: getAnimSavePath(configProp.value),
        keyframeName: getKeyframeName.value,
        animPhase: animPhase.value,
        config: getSpring.value,
      },
    });
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
