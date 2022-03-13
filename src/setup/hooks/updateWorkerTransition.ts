import { globalState } from "../../state";
import { ConstructAnim } from "../../state/types";
import { DynamicObject } from "../../types";
import asyncWorker from "../../worker/asyncWorker";

export default function updateWorkerTransition(
  transitions: DynamicObject<ConstructAnim>
) {
  if (!globalState.webWorker) {
    return;
  }

  // store parsed transitions
  const parsedTransitions: DynamicObject<string> = {};

  for (const key in transitions) {
    parsedTransitions[key] = transitions[key].toString();
  }

  asyncWorker({
    type: "addTransition",
    data: parsedTransitions,
  });
}
