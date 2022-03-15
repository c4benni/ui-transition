import { SpringObject } from "../../props/types";
import { DynamicObject } from "../../types";
export declare type SpringPreset = DynamicObject<SpringObject>;
export interface AddSpring extends SpringObject {
    extends?: string;
}
