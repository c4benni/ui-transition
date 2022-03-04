import { capitalize, ComputedRef, Ref, RendererElement } from "vue";
import { SpringObject } from "../../../props/types";
import { globalState } from "../../../state";
import {
  AnimPhase,
  BuildAnim,
  ConfigProp,
  DynamicObject,
  Emit,
} from "../../../types";
import asyncWorker from "../../../worker/asyncWorker";
import { Hook, UiTransitionElement } from "../types";
import { $emit, getState, setAnimState, setProperties } from "../utils";
import hasWaapi from "./hasWaapi";
import noWaapi from "./noWaapi";

export default function beforeAnimStart(
  e: RendererElement,
  hook: Hook,
  animPhase: Ref<AnimPhase>,
  emit: Emit,
  configProp: ComputedRef<BuildAnim | null>,
  getKeyframeName: ComputedRef<string>,
  getDuration: ComputedRef<string>,
  getDelay: ComputedRef<string>,
  getEase: ComputedRef<string>,
  getSpring: ComputedRef<SpringObject>,
  propsConfig: ConfigProp
) {
  const state = getState(hook);

  const { waapi } = globalState;

  setAnimState(state, animPhase);

  $emit(emit, `before${capitalize(hook)}`, [e]);

  if (!configProp.value) {
    return;
  }

  const delay = parseFloat(getDelay.value) || 0;

  const el = e as unknown as UiTransitionElement;

  // setup el if there's no waapi instance
  if (!waapi) {
    setProperties(el, {
      "--uit-delay": `${delay}ms`,
    });

    el.classList.add("ui-transition");
  }

  // get first frame of the transition. This value is an object.
  const firstFrame = configProp.value.frame(
    (from: number | number[], _: number | number[]) => from,
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

  const resetPreviousStyles = () => {
    // clear previous styles
    if (el.__previousStyles) {
      Object.assign(el.style, el.__previousStyles);

      delete el.__previousStyles;
    }
  };

  const createSpring = async (): Promise<DynamicObject<any>> => {
    if (!configProp.value) return Promise.resolve({});

    return asyncWorker({
      type: "spring",
      data: {
        buildAnim: propsConfig,
        // TODO:  savePath: getAnimSavePath(configProp.value),
        keyframeName: getKeyframeName.value,
        waapi,
        animPhase: animPhase.value,
        config: getSpring.value,
      },
    });
  };

  if (waapi) {
    hasWaapi(
      createSpring,
      getDuration.value,
      el,
      getEase.value,
      delay,
      resetPreviousStyles
    );
  } else {
    noWaapi(getKeyframeName.value, createSpring, el, resetPreviousStyles);
  }
}
