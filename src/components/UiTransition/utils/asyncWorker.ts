import { AsyncWorker } from "../types/worker";
import workerBox from "./workerBox";

const asyncWorker: AsyncWorker = function ({ type, data, parse }) {
  const worker = workerBox.webWorker;

  const validWorker = worker instanceof Worker;

  if (!validWorker) {
    return new Promise((_, reject) => {
      reject("Invalid worker, Please report this issue");
    });
  }

  const uid = performance.now();

  worker.postMessage({
    name: "uit",
    type,
    parse,
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
