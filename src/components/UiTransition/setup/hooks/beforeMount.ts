import { onBeforeMount } from "vue";
import createWorker from "../../worker/createWorker";
import { globalState } from "../../state";
import asyncWorker from "../../worker/asyncWorker";
import extractConfig from "../../utils/extractConfig";
import transitions from "../../state/transitions";
import { BuildAnim, DynamicObject } from "../../types";

type CreateStyleTag = () => string;

const createStyleTag: CreateStyleTag = () => {
  const id = `uit-style-${performance.now().toString(36).replace(/\./g, "-")}`;

  const existingStyleEl = document.getElementById(id);

  if (existingStyleEl) {
    existingStyleEl.remove();
  }

  const style = document.createElement("style");

  style.id = id;

  (document.head || document.querySelector("head")).append(style);

  return id;
};

export default function beforeMount() {
  if (!globalState.init) {
    globalState.init = true;

    onBeforeMount(() => {
      // set globalState.waapi
      globalState.waapi = typeof HTMLElement.prototype.animate === "function";

      // or create a style tag.
      if (!globalState.waapi) {
        globalState.styleId = createStyleTag();
      }

      // create worker
      if (!globalState.webWorker) {
        globalState.webWorker = createWorker();

        // send methods to worker
        asyncWorker({
          type: "addMethod",
          data: {
            extractConfig: extractConfig.toString(),
          },
        });

        // send saved transitions to worker

        // store parsed transitions
        const parsedTransitions: DynamicObject<string> = {};

        for (const key in transitions) {
          parsedTransitions[key] = transitions[key].toString();
        }

        asyncWorker({
          type: "addTransition",
          data: parsedTransitions,
        });
      }
    });
  }
}
