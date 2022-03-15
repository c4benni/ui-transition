import { Slots, VNode } from "vue";
import { DynamicObject } from "../../types";
export declare type TransitionEl = (arg: {
    slots: Slots;
    data: DynamicObject<any>;
}) => VNode;
