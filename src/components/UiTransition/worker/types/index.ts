import { DynamicObject } from "../../types";

export type AsyncWorker = (arg: {
  // type of worker call
  type: "spring" | "sleep";

  data?: DynamicObject<any>;
}) => Promise<DynamicObject<any>>;
