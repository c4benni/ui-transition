import { Ref, RendererElement } from "vue";
import { kebabCase } from "..";
import { AnimPhase, DynamicObject, Emit } from "../../types";
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

// emit events as camelCase, and kebab-case; so it could easily work with both templates, and render functions.
export const $emit = (emit: Emit, evt: string, args: any[]) => {
  emit(kebabCase(evt), args);
  emit(evt, args);
};

export function resetEl(e: RendererElement) {
  const { waapi } = globalState;

  if (!waapi) {
    const el = e as unknown as UiTransitionElement;

    el.classList.remove("ui-transition");

    [
      "--uit-anim-duration",
      "--uit-anim-name",
      "--uit-delay",
      "--uit-ease",
    ].forEach((prop) => {
      el.style.removeProperty(prop);
    });
  }
}
