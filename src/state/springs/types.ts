import { SpringObject } from "../../props/types";
import { DynamicObject } from "../../types";

export type SpringPreset = DynamicObject<SpringObject>;

// add a new spring with an extend option
export interface AddSpring extends SpringObject {
  extends?: string;
}
