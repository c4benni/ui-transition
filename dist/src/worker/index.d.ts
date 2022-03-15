import { BuildAnim, DynamicObject } from "../types";
declare global {
    interface Window {
        saved: DynamicObject<any>;
        transitions: DynamicObject<(...args: any[]) => BuildAnim>;
        methods: DynamicObject<any>;
        __spreadValues: Function;
    }
}
declare const _default: string;
export default _default;
