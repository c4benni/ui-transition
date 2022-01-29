export default function addWorkerEvent(worker: Worker) {
  worker.addEventListener("message", (e) => {
    if (e.data?.name === "ui-transition") {
      console.log(e);
    }
  });
}
