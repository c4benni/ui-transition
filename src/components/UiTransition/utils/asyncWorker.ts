import { AsyncWorker } from "../types/worker";

const asyncWorker: AsyncWorker = function ({ worker, type, data, parse }) {
  const validWorker = worker instanceof Worker;

  if (!validWorker) {
    return new Promise((_, reject) => {
      reject("Invalid worker");
    });
  }

  const uid = performance.now();

  worker.postMessage({
    name: "ui-transition",
    type,
    parse,
    data,
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
