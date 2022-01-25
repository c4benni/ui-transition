import workerString from "./worker";

export function createWorker(): Worker {
  const blob = new Blob([workerString], {
    type: "text/javascript",
  });

  const url = window.URL.createObjectURL(blob);

  return new Worker(url, {
    name: "ui-transition-worker",
    credentials: "same-origin",
    type: "module",
  });
}

export function addWorkerEvents(worker: Worker) {
  worker.addEventListener("message", (e) => {
    if (e.data?.name === "ui-transition") {
      console.log(e);
    }
  });
}
