import { BaseTransitionProps, capitalize, RendererElement } from "vue";

import { DoneCallback, EventHook, Hook } from "./types";

import beforeAnimStart from "./beforeAnimStart";
import animStart from "./animStart";
import animDone from "./animDone";
import animcancelled from "./animCancelled";

const eventHooks: EventHook = function (args) {
  const {
    configProp,
    getKeyframeName,
    animPhase,
    appear,
    emit,
    getDelay,
    getDuration,
    getEase,
    getSpring,
  } = args;

  // create event hooks.
  // eg: beforeAppear, appear, appearcancelled, afterAppear...
  const getHooks = (hook: Hook): BaseTransitionProps => {
    if (hook === "appear" && !appear) return {};

    const capitalizeHook = capitalize(hook);

    return {
      [`onBefore${capitalizeHook}`]: (el: RendererElement) => {
        beforeAnimStart(
          el,
          hook,
          animPhase,
          emit,
          configProp,
          getKeyframeName,
          getDuration,
          getDelay,
          getEase,
          getSpring
        );
      },

      [`on${capitalizeHook}`]: (el: RendererElement, done: DoneCallback) => {
        animStart(el, done, hook, emit, animPhase, configProp, getKeyframeName);
      },

      [`on${capitalizeHook}cancelled`]: (el: RendererElement) => {
        animcancelled(el, hook, emit);
      },

      [`onAfter${capitalizeHook}`]: (el: RendererElement) => {
        animDone(el, hook, emit, animPhase);
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
