<script lang="ts">
import { computed, defineComponent, ref, TransitionProps } from "vue";

import props from "./props";

import TransitionGroup from "./setup/transitionGroup";

import Transition from "./setup/transition";

import beforeMount from "./setup/hooks/beforeMount";

import { AnimPhase } from "./types";

import extractConfig from "./utils/extractConfig";

import keyframeName from "./utils/keyframeName";

import eventHooks from "./utils/eventHooks";

import extractDurationAndDelay from "./utils/extractDurationAndDelay";

import extractEase from "./utils/extractEase";
import extractSpring from "./utils/extractSpring";

export default defineComponent({
  name: "UiTransition",

  props,

  setup(_props, { slots, emit }) {
    const animPhase = ref<AnimPhase>("enter");

    const props = computed(() => _props);

    const getConfig = computed(() =>
      extractConfig(props.value.config, animPhase.value)
    );

    const getDuration = computed(() =>
      extractDurationAndDelay(
        props.value.duration,
        getConfig.value.duration,
        animPhase.value
      )
    );

    const getDelay = computed(() =>
      extractDurationAndDelay(
        props.value.delay,
        getConfig.value.delay,
        animPhase.value
      )
    );

    const getEase = computed(() =>
      extractEase(props.value.ease, getConfig.value.ease || "", animPhase.value)
    );

    const getSpring = computed(() =>
      extractSpring(props.value.spring, getConfig.value.spring, animPhase.value)
    );

    const getKeyframeName = computed(() =>
      keyframeName(getConfig.value, getSpring.value, animPhase.value)
    );

    beforeMount();

    return function () {
      const transitionElArgs = {
        slots,
        data: {
          css: false,
          appear: props.value.appear,
          mode: props.value.mode,

          ...eventHooks({
            animPhase,
            appear: props.value.appear,
            configProp: getConfig,
            emit,
            getKeyframeName,
            getDuration,
            getDelay,
            getEase,
            getSpring,
            propsConfig: props.value.config,
          }),
        } as TransitionProps,
      };

      if (props.value.group) {
        return TransitionGroup(transitionElArgs);
      }

      return Transition(transitionElArgs);
    };
  },
});
</script>

<style scoped>
.ui-transition {
  will-change: var(--ui-anim-will-change, contents) !important;
  animation-timing-function: var(--ui-anim-ease, linear) !important;
  animation-delay: var(--uit-delay) !important;
  animation-name: var(--uit-anim-name) !important;
  animation-duration: var(--uit-anim-duration) !important;
  transition-duration: 0ms !important;
}
</style>
