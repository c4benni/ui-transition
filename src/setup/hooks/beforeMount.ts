import { globalState } from "../../state";

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
  }
}
