import { DynamicObject } from "../types";
import { ConstructAnim } from "./types";
declare let transitions: DynamicObject<ConstructAnim>;
export default transitions;
export declare function addTransition(name: string, transition: ConstructAnim): void;
export declare function removeTransition(name: string): void;
