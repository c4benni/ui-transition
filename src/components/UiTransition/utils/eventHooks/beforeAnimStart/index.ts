import { capitalize, ComputedRef, Ref, RendererElement } from "vue";
import { SpringObject } from "../../../props/types";
import { globalState } from "../../../state";
import { AnimPhase, BuildAnim, DynamicObject, Emit } from "../../../types";
import asyncWorker from "../../../worker/asyncWorker";
import { Hook, UiTransitionElement } from "../types";
import { $emit, getState, setAnimState, setProperties } from "../utils";

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
  getSpring: ComputedRef<SpringObject>
) {
  const state = getState(hook);

  const { styleId, keyframes, waapi } = globalState;

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

  asyncWorker({
    type: "spring",
    data: {
      ...configProp.value,
      frame: configProp.value.frame.toString(),
      // TODO:  savePath: getAnimSavePath(configProp.value),
      keyframeName: getKeyframeName.value,
      waapi,
      animPhase: animPhase.value,
      config: getSpring.value,
    },
  }).then((animObject) => {
    const {
      data: { cssText, duration },
    } = animObject;

    console.log(duration);

    if (!waapi) {
      if (!keyframes[getKeyframeName.value]) {
        keyframes[getKeyframeName.value] = duration;

        const styleTag = document.getElementById(`${styleId}`);

        if (styleTag) {
          styleTag.innerText += cssText;
        }
      }
    } else {
      const animDuration = getDuration.value || duration;

      const anim = el.animate(cssText, {
        duration: parseFloat(animDuration),
        easing: getEase.value,
        delay,
      });

      anim.addEventListener(
        "finish",
        () => {
          el.__done?.();

          resetPreviousStyles();
        },
        { once: true }
      );

      anim.addEventListener(
        "cancel",
        () => {
          el.__done?.(true);

          resetPreviousStyles();
        },
        { once: true }
      );

      if (delay) {
        const timeout = setTimeout(() => {
          resetPreviousStyles();

          clearTimeout(timeout);
        }, delay);
      } else resetPreviousStyles();
    }
  });
}
