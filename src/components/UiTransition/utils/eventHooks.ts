import { BaseTransitionProps, capitalize, RendererElement } from "vue";
import { DoneCallback, EventHook, Hook } from "../types/eventHooks";
import { AnimState, DynamicObject } from "../types/utils";
import asyncWorker from "./asyncWorker";
import { getAnimSavePath, kebabCase } from "./component";
import sleep from "./sleep";

const toggleAnimEvents = (
  action: "add" | "remove",
  el: HTMLElement | null,
  callback: (evt: AnimationEvent) => void
): void => {
  el &&
    ["animationend", "animationcancel"].forEach((evt) => {
      // @ts-ignore
      el[`${action}EventListener`](evt, callback);
    });
};

const setProperties = (
  el: HTMLElement,
  styleProps: DynamicObject<string | number | undefined>
) => {
  for (const key in styleProps) {
    const value = styleProps[key];

    if (typeof value != "undefined") {
      el.style.setProperty(key, `${value}`.replace(/\{|\}/g, ""));
    }
  }
};

const eventHooks: EventHook = function (args) {
  const {
    configProp,
    keyframes,
    getKeyframeName,
    styleId,
    animState,
    appear,
    emit,
  } = args;

  const setAnimState = (arg: AnimState) => (animState.value = arg);

  const handleKeyframeNameExcapeChar = (keyframe: string) =>
    keyframe.replace(/\\=/g, "=");

  const $emit = (evt: string, args: any[]) => {
    emit(kebabCase(evt), args);
    emit(evt, args);
  };

  const getState = (hook: Hook): AnimState =>
    hook === "leave" ? "leave" : "enter";

  const beforeAnimStart = (e: RendererElement, hook: Hook) => {
    const state = getState(hook);

    setAnimState(state);

    $emit(`before${capitalize(hook)}`, [e]);

    if (!configProp.value) {
      return;
    }

    const el = e as unknown as HTMLElement;

    setProperties(el, {
      "--uit-delay": configProp.value.delay,
      "--uit-opacity": configProp.value.from?.opacity,
      "--uit-transform": configProp.value.from?.transform,
    });

    el.classList.add("ui-transition");

    if (!keyframes[getKeyframeName.value]) {
      asyncWorker({
        type: "spring",
        parse: true,
        data: {
          ...configProp.value,
          savePath: getAnimSavePath(configProp.value),
          keyframeName: getKeyframeName.value,
        },
      }).then((animObject) => {
        const cssText = animObject.data.cssText;

        keyframes[getKeyframeName.value] = cssText.duration;

        const styleTag = document.getElementById(`${styleId}`);

        if (styleTag) {
          styleTag.innerText += animObject.data.cssText.keyframes;
        }
      });
    }
  };

  const animStart = (
    e: RendererElement,
    done: (cancelled?: boolean) => void,
    hook: Hook
  ) => {
    const state = getState(hook);

    setAnimState(state);

    $emit(hook, [e]);

    if (!configProp.value) {
      return;
    }

    const el = e as unknown as HTMLElement;

    const eventCallback = (evt: AnimationEvent) => {
      if (
        evt.target === evt.currentTarget &&
        handleKeyframeNameExcapeChar(evt.animationName) ===
          handleKeyframeNameExcapeChar(getKeyframeName.value)
      ) {
        const elem = evt.target as unknown as HTMLElement | null;

        done(evt.type === "animationcancel");

        toggleAnimEvents("remove", elem, eventCallback);
      }
    };

    toggleAnimEvents("add", el, eventCallback);

    sleep().then(() => {
      el.addEventListener(
        "animationstart",
        (e) => {
          if (
            e.target &&
            el.isSameNode(e.target as HTMLElement) &&
            handleKeyframeNameExcapeChar(e.animationName) ===
              handleKeyframeNameExcapeChar(getKeyframeName.value)
          ) {
            setProperties(el, {
              "--uit-opacity": configProp.value?.to?.opacity,
              "--uit-transform": configProp.value?.to?.transform,
            });
          }
        },
        { once: true }
      );

      const getDuration = () => {
        if (/string|number/.test(typeof configProp.value?.duration)) {
          return parseFloat(`${configProp.value?.duration}`) || 1;
        }
        return keyframes[getKeyframeName.value];
      };

      setProperties(el, {
        "--uit-anim-duration": `${getDuration()}ms`,
        "--uit-anim-name": getKeyframeName.value,
      });
    });
  };

  const animCancelled = (el: RendererElement, hook: Hook) => {
    $emit(`${hook}Cancelled`, [el]);
  };

  const animDone = (e: RendererElement, hook: Hook) => {
    const state = getState(hook);

    setAnimState(state);

    const el = e as unknown as HTMLElement;

    $emit(`after${capitalize(hook)}`, [e]);

    el.classList.remove("ui-transition");

    [
      "--uit-anim-duration",
      "--uit-anim-name",
      "--uit-delay",
      "--uit-transform",
      "--uit-opacity",
    ].forEach((prop) => {
      el.style.removeProperty(prop);
    });
  };

  const getHooks = (hook: Hook): BaseTransitionProps => {
    if (hook === "appear" && !appear) return {};

    const capitalizeHook = capitalize(hook);

    return {
      [`onBefore${capitalizeHook}`]: (el: RendererElement) => {
        beforeAnimStart(el, hook);
      },
      [`on${capitalizeHook}`]: (el: RendererElement, done: DoneCallback) => {
        animStart(el, done, hook);
      },
      [`on${capitalizeHook}Cancelled`]: (el: RendererElement) => {
        animCancelled(el, hook);
      },
      [`onAfter${capitalizeHook}`]: (el: RendererElement) => {
        animDone(el, hook);
      },
    };
  };

  return {
    ...getHooks("appear"),
    ...getHooks("enter"),
    ...getHooks("leave"),
  };
};

export default eventHooks;
