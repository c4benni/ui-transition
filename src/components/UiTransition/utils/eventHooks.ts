import {
  BaseTransitionProps,
  ComputedRef,
  nextTick,
  Ref,
  RendererElement,
} from "vue";
import { ConfigDirection } from "../types/props/config";
import { AnimState, DynamicObject } from "../types/utils";
import asyncWorker from "./asyncWorker";
import { getAnimSavePath } from "./component";
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

const setProperty = (
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

export default function eventHooks({
  configProp,
  keyframes,
  getKeyframeName,
  styleId,
  animState,
}: {
  configProp: ConfigDirection | null;
  keyframes: DynamicObject<number>;
  getKeyframeName: ComputedRef<string>;
  styleId: string;
  animState: Ref<AnimState>;
}): BaseTransitionProps {
  const setAnimState = (arg: AnimState) => (animState.value = arg);

  const handleKeyframeNameExcapeChar = (keyframe: string) =>
    keyframe.replace(/\\=/, "=");

  const beforeAppearOrEnter = (e: RendererElement) => {
    setAnimState("enter");

    if (!configProp) {
      return;
    }

    const el = e as unknown as HTMLElement;

    setProperty(el, {
      "--uit-delay": configProp.delay,
      "--uit-opacity": configProp.from?.opacity,
      "--uit-transform": configProp.from?.transform,
    });

    el.classList.add("ui-transition");

    if (!keyframes[getKeyframeName.value]) {
      asyncWorker({
        type: "spring",
        parse: true,
        data: {
          ...configProp,
          savePath: getAnimSavePath(configProp),
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

  const appearOrEnter = async (
    e: RendererElement,
    done: (canceled?: boolean) => void
  ) => {
    setAnimState("enter");

    if (!configProp) {
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

    nextTick().then(async () => {
      toggleAnimEvents("add", el, eventCallback);

      await sleep();

      el.addEventListener(
        "animationstart",
        (e) => {
          if (
            e.target &&
            el.isSameNode(e.target as HTMLElement) &&
            handleKeyframeNameExcapeChar(e.animationName) ===
              handleKeyframeNameExcapeChar(getKeyframeName.value)
          ) {
            setProperty(el, {
              "--uit-opacity": configProp.to?.opacity,
              "--uit-transform": configProp.to?.transform,
            });
          }
        },
        { once: true }
      );

      setProperty(el, {
        "--uit-anim-duration": `${keyframes[getKeyframeName.value]}ms`,
        "--uit-anim-name": getKeyframeName.value,
      });
    });
  };

  const animDone = (e: RendererElement) => {
    const el = e as unknown as HTMLElement;
    [
      "--uit-anim-duration",
      "--uit-anim-name",
      "--uit-delay",
      "--uit-transform",
      "--uit-opacity",
    ].forEach((prop) => {
      el.style.removeProperty(prop);
    });

    el.classList.remove("ui-transition");
  };

  return {
    onBeforeAppear: beforeAppearOrEnter,
    onAppear: appearOrEnter,
    onAfterAppear: animDone,
    onBeforeEnter: beforeAppearOrEnter,
    onEnter: appearOrEnter,
    onAfterEnter: animDone,
  };
}
