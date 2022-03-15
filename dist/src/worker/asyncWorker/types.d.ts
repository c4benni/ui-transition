import { DynamicObject } from "../../types";
export declare type AsyncWorker = (arg: {
    type: "spring" | "sleep" | "addTransition" | "addMethod";
    data?: DynamicObject<any>;
}) => Promise<DynamicObject<any>>;
