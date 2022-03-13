import { nextTick } from "vue";
import { globalState } from "../../state";
import { AsyncWorker } from "./types";

let calls = 0;

const asyncWorker: AsyncWorker = async function ({ type, data }) {
  calls += 0.0001;

  const worker = globalState.webWorker;

  const validWorker = worker instanceof Worker;

  if (!validWorker) {
    return Promise.reject("Invalid worker, Please report this issue");
  }

  const uid = calls;

  worker.postMessage({
    name: "uit",
    uid,
    type,
    data: data || {},
  });

  return new Promise((resolve) => {
    const callback = (e: MessageEvent) => {
      if (e.data?.uid === uid) {
        worker.removeEventListener("message", callback, {
          passive: true,
        } as EventListenerOptions);

        resolve({
          data: e.data?.data || null,
        });
      }
    };

    worker.addEventListener("message", callback, { passive: true });
  });
};

export default asyncWorker;
