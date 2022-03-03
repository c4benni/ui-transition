import asyncWorker from "../asyncWorker";

export default async function sleep(duration?: number, callback?: Function) {
  await asyncWorker({
    type: "sleep",
    data: {
      duration,
    },
  });

  // if a function is passed as the second argument, this `sleep` call will just handle that callback after the worker responds. This is more like a synchronous call
  if (typeof callback === "function") {
    return callback();
  }
  //   if no function is called, then this `sleep` call will be asynchronous, like vue's $nextTick.
  else return Promise.resolve();
}
