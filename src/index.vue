<script lang="ts">
import { onBeforeMount } from "vue";

import { computed, defineComponent, ref } from "vue";

import props from "./props";

import TransitionGroup from "./setup/transitionGroup";

import Transition from "./setup/transition";

import beforeMount from "./setup/hooks/beforeMount";

import { AnimPhase, TransitionElProps } from "./types";

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

    const fragment = computed(() => {
      return props.value.group && !props.value.tag;
    });

    onBeforeMount(beforeMount);

    return function () {
      const transitionElArgs = {
        slots,
        data: {
          type: "animation",
          css: props.value.css,
          appear: props.value.appear,
          mode: props.value.group ? undefined : props.value.mode,
          tag: props.value.group ? props.value.tag : undefined,
          moveClass: props.value.group ? props.value.moveClass : undefined,

          enterFromClass: props.value.enterFromClass,
          enterActiveClass: props.value.enterActiveClass,
          enterToClass: props.value.enterToClass,
          appearFromClass: props.value.appearFromClass,
          appearActiveClass: props.value.appearActiveClass,
          appearToClass: props.value.appearToClass,
          leaveFromClass: props.value.leaveFromClass,
          leaveActiveClass: props.value.leaveActiveClass,
          leaveToClass: props.value.leaveToClass,

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
            fragment,
            retainFinalStyle: props.value.retainFinalStyle,
          }),
        } as TransitionElProps,
      };

      if (props.value.group) {
        return TransitionGroup(transitionElArgs);
      }

      return Transition(transitionElArgs);
    };
  },
});
</script>
