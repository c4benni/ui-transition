import { Ref, RendererElement } from "vue";
import { kebabCase } from "..";
import { AnimPhase, BuildAnim, DynamicObject } from "../../types";
import { Hook, UiTransitionElement } from "./types";
import { globalState } from "../../state";

export const setProperties = (
  el: HTMLElement,
  styleProps: DynamicObject<string | number | undefined>
) => {
  for (const key in styleProps) {
    const value = styleProps[key];

    if (typeof value != "undefined") {
      el.style.setProperty(key, `${value}`);
    }
  }
};

export const toggleAnimEvents = (
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

export const getState = (hook: Hook): AnimPhase =>
  hook === "leave" ? "leave" : "enter";

export const setAnimState = (arg: AnimPhase, animPhase: Ref<string>) =>
  (animPhase.value = arg);

export function resetEl(e: RendererElement) {
  const el = e as unknown as UiTransitionElement;

  el.classList.remove("ui-transition", "ui-transition-paused");

  [
    "--uit-anim-duration",
    "--uit-anim-name",
    "--uit-delay",
    "--uit-ease",
  ].forEach((prop) => {
    el.style.removeProperty(prop);
  });
}

export function getFrame(
  configProp: BuildAnim,
  animPhase: AnimPhase,
  lastFrame?: boolean
) {
  const step = (from: number | number[], to: number | number[]) =>
    lastFrame ? to : from;

  if (Array.isArray(configProp?.frames)) {
    const frames = {};

    configProp?.frames.forEach((item) => {
      Object.assign(frames, item.frame(step, animPhase));
    });

    return frames;
  }

  return configProp?.frame(step, animPhase);
}
