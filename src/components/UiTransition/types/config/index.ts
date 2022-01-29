import { ConfigAsObject } from "../props/config";
import { DynamicObject } from "../utils";

export type AnimAsFunction = (...args: (string | number)[]) => ConfigAsObject;

export type AnimConfig = DynamicObject<AnimAsFunction>;
