import { BaseTransitionProps, capitalize, RendererElement } from "vue";

import { DoneCallback, EventHook, Hook } from "./types";

import beforeAnimStart from "./beforeAnimStart";
import animStart from "./animStart";
import animDone from "./animDone";
import animCancelled from "./animCancelled";

const eventHooks: EventHook = function (args) {
  const {
    configProp,
    getKeyframeName,
    animPhase,
    appear,
    getDelay,
    getDuration,
    getEase,
    getSpring,
    fragment,
    retainFinalStyle,
    inProgress,
  } = args;

  // create event hooks.
  // eg: beforeAppear, appear, appearcancelled, afterAppear...
  const getHooks = (hook: Hook): BaseTransitionProps => {
    if (hook === "appear" && !appear) return {};

    const capitalizeHook = capitalize(hook);

    return {
      [`onBefore${capitalizeHook}`]: (el: RendererElement) => {
        inProgress.value = true;

        beforeAnimStart(
          el,
          hook,
          animPhase,
          configProp,
          getKeyframeName,
          getDuration,
          getDelay,
          getEase,
          getSpring
        );
      },

      [`on${capitalizeHook}`]: (el: RendererElement, done: DoneCallback) => {
        inProgress.value = true;

        animStart(el, done, hook, animPhase, configProp);
      },

      ...(fragment.value
        ? {}
        : {
            [`on${capitalizeHook}cancelled`]: (el: RendererElement) => {
              inProgress.value = false;

              animCancelled(el, hook);
            },
          }),

      [`onAfter${capitalizeHook}`]: (el: RendererElement) => {
        inProgress.value = false;

        animDone(el, hook, animPhase, configProp, retainFinalStyle);
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
