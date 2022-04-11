import { AnimPhase, BuildAnim, ConfigProp } from "src/types";
import { keyframeNameExtras } from "../../utils";
import {
  BaseTransitionProps,
  computed,
  ComputedRef,
  nextTick,
  RendererElement,
} from "vue";

type GetHooks = (
  configProp: ComputedRef<BuildAnim>,
  keyframeNameExtras: string
) => BaseTransitionProps<RendererElement>;

export default function animate(
  el: RendererElement,
  config: ConfigProp,
  getHooks: GetHooks,
  extractConfig: (configProp: ConfigProp, animPhase: AnimPhase) => BuildAnim
) {
  const elExists = el instanceof HTMLElement && document.contains(el);

  if (!elExists) {
    return Promise.resolve(
      console.error(
        "<UiTransition />: Ooops! An unreachable element cannot be animated."
      )
    );
  }

  const hooks = getHooks(
    computed(() => extractConfig(config, "enter")),
    keyframeNameExtras(config)
  );

  return new Promise((resolve) => {
    nextTick(() => {
      hooks.onBeforeEnter?.(el);

      requestAnimationFrame(() => {
        hooks.onEnter?.(el, () => {
          hooks.onAfterEnter?.(el);

          resolve(el);
        });
      });
    });
  });
}
