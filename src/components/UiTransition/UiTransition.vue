<script lang="ts">
import { defineComponent, h, onBeforeMount } from "@vue/runtime-core";
import { Transition } from "@vue/runtime-dom";

import {addWorkerEvents, createWorker} from './utils/main'

let styleCreated = false;

let styleId = "";

let workerCreated = false;

function createStyleNode(): void {
  if (!styleCreated) {
    const styleNode = document.createElement("style");

    styleId = `ui-${performance.now().toString(36).replace(/\./g, "-")}`;

    styleNode.id = styleId;

    (document.head || document.querySelector("head")).append(styleNode);

    styleCreated = true
  }
}

let webWorker: Worker;

export default defineComponent({
  name: "UiTransition",

  setup(_, { slots }) {
    onBeforeMount(() => {
      createStyleNode();
      
      if(!workerCreated){
        webWorker = createWorker();

        addWorkerEvents(webWorker)
        
        workerCreated = true;
      }
    });

    return () => [
      h(
        Transition,
        {
          onBeforeEnter:()=>{
            console.log(webWorker);
            
    webWorker.postMessage({
      name:'ui-transition'
    });

          }
        },
        {
          default: () => slots.default?.() || null,
        }
      ),
    ];
  },
});
</script>
