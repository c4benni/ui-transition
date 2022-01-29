import {
  BaseTransitionProps,
  ComputedRef,
  nextTick,
  RendererElement,
} from "vue";
import { DynamicObject } from "../types/utils";
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

export default function eventHooks({
  tempConfig,
  keyframes,
  getKeyframeName,
  styleId,
}: {
  tempConfig: { delay: any; from: { opacity: any; transform: any } };
  keyframes: DynamicObject<number>;
  getKeyframeName: ComputedRef<string>;
  styleId: string;
}): BaseTransitionProps {
  const beforeAppearOrEnter = (e: RendererElement) => {
    const el = e as unknown as HTMLElement;

    el.classList.add("ui-transition");

    const styleProps: DynamicObject<string | number> = {
      "--uit-delay": tempConfig.delay,
      "--uit-opacity": tempConfig.from.opacity,
      "--uit-transform": tempConfig.from.transform,
    };

    for (const key in styleProps) {
      el.style.setProperty(key, `${styleProps[key]}`.replace(/\{|\}/g, ""));
    }

    if (!keyframes[getKeyframeName.value]) {
      asyncWorker({
        type: "spring",
        parse: true,
        data: {
          ...tempConfig,
          savePath: getAnimSavePath(tempConfig),
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
    const el = e as unknown as HTMLElement;
    const eventCallback = (evt: AnimationEvent) => {
      if (
        evt.target === evt.currentTarget &&
        evt.animationName === getKeyframeName.value
      ) {
        const elem = evt.target as unknown as HTMLElement | null;

        done(evt.type === "animationcancel");

        [
          "--uit-anim-duration",
          "--uit-anim-name",
          "--uit-delay",
          "--uit-transform",
          "--uit-opacity",
        ].forEach((prop) => {
          elem?.style.removeProperty(prop);
        });

        elem?.classList.remove("ui-transition");

        toggleAnimEvents("remove", elem, eventCallback);
      }
    };

    nextTick().then(async () => {
      toggleAnimEvents("add", el, eventCallback);

      await sleep();

      const styleProps: DynamicObject<string> = {
        "--uit-anim-duration": `${keyframes[getKeyframeName.value]}ms`,
        "--uit-anim-name": getKeyframeName.value,
      };

      for (const key in styleProps) {
        el.style.setProperty(key, styleProps[key]);
      }
    });
  };

  return {
    onBeforeAppear: beforeAppearOrEnter,
    onAppear: appearOrEnter,
    onBeforeEnter: beforeAppearOrEnter,
    onEnter: appearOrEnter,
  };
}
