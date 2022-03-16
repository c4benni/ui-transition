import createWorker from "../../worker/createWorker";
import { globalState } from "../../state";
import asyncWorker from "../../worker/asyncWorker";
import extractConfig from "../../utils/extractConfig";
import transitions from "../../state/transitions";
import updateWorkerTransition from "./updateWorkerTransition";

type CreateStyleTag = () => string;

let styleIdCalls = -1;

const createStyleTag: CreateStyleTag = () => {
  styleIdCalls += 1;

  const id = `uit-style-el-${styleIdCalls}`;

  const existingStyleEl = document.getElementById(id);

  if (existingStyleEl) {
    existingStyleEl.remove();
  }

  const style = document.createElement("style");

  style.id = id;

  style.innerText = `.ui-transition{animation-timing-function:var(--uit-ease,linear)!important;animation-delay:var(--uit-delay)!important;animation-name:var(--uit-anim-name)!important;animation-duration:var(--uit-anim-duration)!important;transition-duration:0ms!important;}`;

  (document.head || document.querySelector("head")).append(style);

  return id;
};

export default function beforeMount() {
  if (!globalState.init) {
    globalState.init = true;

    globalState.styleId = createStyleTag();

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
      updateWorkerTransition(transitions);
    }
  }
}
