import workerString from "..";

export default function createWorker(): Worker {
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
