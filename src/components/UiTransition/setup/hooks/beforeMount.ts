import { onBeforeMount } from "vue";
import createWorker from "../../worker/createWorker";
import { globalState } from "../../state";

type CreateStyleTag = () => string;

const createStyleTag: CreateStyleTag = () => {
  const id = `uit-style-${performance.now()}`.replace(/\./g, "-");

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
      globalState.webWorker = createWorker();
    });
  }
}
