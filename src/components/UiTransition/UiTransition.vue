<script lang="ts">
import { computed, defineComponent, h, onBeforeMount, ref } from "@vue/runtime-core";
import { Transition } from "@vue/runtime-dom";

import { AnimState, DynamicObject, GlobalState } from "./types/utils";

import extractConfig from './utils/extractConfig'

import props from "./props";

import { createStyleNode, keyframeName } from "./utils/component";

import eventHooks from "./utils/eventHooks";

import workerBox from "./utils/workerBox";

import createWorker from "./utils/createWorker";

const globalState: GlobalState = {
  styleCreated: false,
  styleId: "",
  workerCreated: false,
};

// store keyframes names as key and a truthy value as value;
// so looking up and deleting will be faster and easy on mem.
const keyframes: DynamicObject<number> = {};

export default defineComponent({
  name: "UiTransition",

  props,

  setup(p, { slots, emit }) {
    const props = computed(()=> p);

    const animState = ref<AnimState>('enter');
    const getExtractedConfig = 
      computed(()=> extractConfig(props.value.config, animState.value));

    const getKeyframeName = 
      computed(() => keyframeName(getExtractedConfig.value));

    onBeforeMount(() => {
      if (!globalState.styleCreated) {
        createStyleNode(globalState);

        globalState.styleCreated = true;
      }

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
            configProp: getExtractedConfig,
            keyframes,
            getKeyframeName,
            styleId: globalState.styleId,
            animState,
            appear: true,
            emit
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
  transform: var(--uit-transform) !important;
  opacity: var(--uit-opacity) !important;
  will-change: transform, opacity !important;
  animation-timing-function: linear !important;
  animation-delay: var(--uit-delay) !important;
  animation-name: var(--uit-anim-name) !important;
  animation-duration: var(--uit-anim-duration) !important;
  transition-duration: 0ms !important;
}
</style>
