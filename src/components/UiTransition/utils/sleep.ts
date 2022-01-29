import asyncWorker from "./asyncWorker";

export default async function sleep(duration: number = 0) {
  await asyncWorker({
    type: "sleep",
    data: {
      duration,
    },
  });
}
