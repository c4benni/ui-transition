import asyncWorker from "../asyncWorker";
import { GetSpring } from "./type";

const getSpring: GetSpring = async function getSpring(frame, config) {
  const spring = await asyncWorker({
    type: "spring",
    data: {
      type: "getSpring",
      config,
      frame,
    },
  });

  return spring.data as number[] | number[][];
};

export default getSpring;
