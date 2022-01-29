<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  onBeforeMount,
} from "@vue/runtime-core";
import { Transition } from "@vue/runtime-dom";

import { DynamicObject, GlobalState } from "./types/utils";

import props from "./props";

import { createStyleNode, keyframeName } from "./utils/component";

import eventHooks from "./utils/eventHooks";

import workerBox from './utils/workerBox'

import createWorker from "./utils/createWorker";

const globalState: GlobalState = {
  styleCreated:false,
  styleId:'',
  workerCreated:false
}

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
      createStyleNode(globalState);

      if (!globalState.workerCreated) {
        workerBox.webWorker = createWorker();

        globalState.workerCreated = true;
      }
    });

    return () => [
      h(
        Transition,
        {
          css: false,
          appear: true,

          ...eventHooks({
            tempConfig,
            keyframes,
            getKeyframeName,
            styleId: globalState.styleId,
          }),
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
