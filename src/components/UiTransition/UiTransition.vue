<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeMount,
  ref,
  Teleport,
} from "@vue/runtime-core";
import { Transition } from "@vue/runtime-dom";
import props from "./props";
import { getAnimSavePath, keyframeName } from "./utils/component";

// import addWorkerEvent from './utils/addWorkerEvent'

import createWorker from "./utils/createWorker";

import asyncWorker from "./utils/asyncWorker";
import { DynamicObject } from "./types/utils";

let styleCreated = false;

let styleId = "";

let workerCreated = false;

function createStyleNode(): void {
  if (!styleCreated) {
    const styleNode = document.createElement("style");

    styleId = `ui-${performance.now().toString(36).replace(/\./g, "-")}`;

    styleNode.id = styleId;

    (document.head || document.querySelector("head")).append(styleNode);

    styleCreated = true;
  }
}

let webWorker: Worker;

// store keyframes names as key and a truthy value as value;
// so looking up and deleting will be faster and easy on mem.
const keyframes: DynamicObject<number> = {};

const tempConfig = {
  from: {
    transform: "scale3d({0.75},{0.75},1)",
    opacity: "{0}",
  },
  to: {
    transform: "scale3d({1},{1},1)",
    opacity: "{1}",
  },
  delay: 0,
  origin: "center",
};

export default defineComponent({
  name: "UiTransition",

  props,

  setup(_, { slots }) {
    const getKeyframeName = computed(() => keyframeName(tempConfig));

    onBeforeMount(() => {
      createStyleNode();

      if (!workerCreated) {
        webWorker = createWorker();

        // do this if $uiSpring is enabled;

        workerCreated = true;
      }
    });

    return () => [
      h(
        Transition,
        {
          onBeforeEnter: async (e) => {
            const el = e as unknown as HTMLElement;

            el.classList.add("ui-transition");

            const styleProps: DynamicObject<string | number> = {
              "--uit-delay": tempConfig.delay,
              "--uit-opacity": tempConfig.from.opacity,
              "--uit-transform": tempConfig.from.transform,
            };

            for (const key in styleProps) {
              el.style.setProperty(
                key,
                `${styleProps[key]}`.replace(/\{|\}/g, "")
              );
            }

            if (!keyframes[getKeyframeName.value]) {
              const animObject = await asyncWorker({
                worker: webWorker,
                type: "spring",
                parse: true,
                data: {
                  ...tempConfig,
                  savePath: getAnimSavePath(tempConfig),
                  keyframeName: getKeyframeName.value,
                },
              });

              const cssText = animObject.data.cssText;

              keyframes[getKeyframeName.value] = cssText.duration;

              const styleTag = document.getElementById(`${styleId}`);

              if (styleTag) {
                styleTag.innerText += animObject.data.cssText.keyframes;
              }
            }
          },

          onEnter: async (e, done) => {
            await nextTick();

            const el = e as unknown as HTMLElement;

            const eventCallback = (evt: AnimationEvent) => {
              if (evt.target === evt.currentTarget) {
                const elem = evt.target as unknown as HTMLElement | null;

                done();

                [
                  "--uit-anim-duration",
                  "--uit-anim-name",
                  "--uit-delay",
                  "--uit-transform",
                  "--uit-opacity",
                ].forEach((prop) => {
                  elem?.style.removeProperty(prop)
                });

                elem?.classList.remove('ui-transition');

                elem?.removeEventListener('animationend',eventCallback)
              }
            };

            el.addEventListener("animationend", eventCallback);

            const timeout = setTimeout(() => {
              const styleProps: DynamicObject<string> = {
                "--uit-anim-duration": `${keyframes[getKeyframeName.value]}ms`,
                "--uit-anim-name": getKeyframeName.value,
              };

              console.log(keyframes[getKeyframeName.value]);
              

              for (const key in styleProps) {
                el.style.setProperty(key, styleProps[key]);
              }

              clearTimeout(timeout);
            }, !keyframes[getKeyframeName.value] ? 16 : 0);
          },
        },
        {
          default: () => slots.default?.() || null,
        }
      ),
    ];
  },
});
</script>

<style scoped>
.ui-transition {
  transform: var(--uit-transform);
  opacity: var(--uit-opacity);
  will-change: transform, opacity;
  animation-timing-function: linear;
  animation-delay: var(--uit-delay);
  animation-name: var(--uit-anim-name);
  animation-duration: var(--uit-anim-duration);
  transition-duration: 0ms !important;
}
</style>
