import { globalState } from "../../state";
import { AsyncWorker } from "./types";

const asyncWorker: AsyncWorker = function ({ type, data }) {
  const worker = globalState.webWorker;

  const validWorker = worker instanceof Worker;

  if (!validWorker) {
    return Promise.reject("Invalid worker, Please report this issue");
  }

  const uid = performance.now();

  worker.postMessage({
    name: "uit",
    type,
    data: data || {},
    uid,
  });

  return new Promise((resolve) => {
    const callback = (e: MessageEvent) => {
      if (e.data?.uid === uid) {
        worker.removeEventListener("message", callback);

        resolve({
          data: e.data?.data || null,
        });
      }
    };

    worker.addEventListener("message", callback);
  });
};

export default asyncWorker;
