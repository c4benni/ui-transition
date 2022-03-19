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
import { Mode } from "./props/types";

export default defineComponent({
  name: "UiTransition",

  props,

  setup(_props, { slots }) {
    const animPhase = ref<AnimPhase>("enter");

    const inProgress = ref(false);

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

    const mode = computed<Mode>(() => {
      if (props.value.group) return undefined;

      if (!props.value.mode) return "default";

      return props.value.mode.toLowerCase() as Mode;
    });

    const getMode = computed(() => {
      if (!mode.value) return undefined;

      if (/out-in|in-out|default/i.test(mode.value)) {
        return mode.value.toLowerCase();
      }

      // custom modes should work as out in
      return "out-in";
    });

    onBeforeMount(beforeMount);

    return function () {
      const transitionElArgs = {
        slots,
        data: {
          type: "transition",
          css: props.value.css,
          appear: props.value.appear,
          mode: getMode.value,
          tag: props.value.group ? props.value.tag : undefined,
          moveClass: props.value.group ? props.value.moveClass : undefined,

          // enterFromClass: props.value.enterFromClass,
          // enterActiveClass: props.value.enterActiveClass,
          // enterToClass: props.value.enterToClass,
          // appearFromClass: props.value.appearFromClass,
          // appearActiveClass: props.value.appearActiveClass,
          // appearToClass: props.value.appearToClass,
          // leaveFromClass: props.value.leaveFromClass,
          // leaveActiveClass: props.value.leaveActiveClass,
          // leaveToClass: props.value.leaveToClass,

          ...eventHooks({
            animPhase,
            appear: props.value.appear,
            configProp: getConfig,
            getKeyframeName,
            getDuration,
            getDelay,
            getEase,
            getSpring,
            fragment,
            retainFinalStyle: props.value.retainFinalStyle,
            inProgress,
            mode,
          }),
        } as TransitionElProps,
        inProgress,
      };

      if (props.value.group) {
        return TransitionGroup(transitionElArgs);
      }

      return Transition(transitionElArgs);
    };
  },
});
</script>
