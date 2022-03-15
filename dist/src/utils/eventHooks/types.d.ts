import { BaseTransitionProps, ComputedRef, Ref } from "vue";
import { SpringObject } from "../../props/types";
import { AnimPhase, BuildAnim, ConfigProp, DynamicObject, Emit } from "../../types";
export declare type EventHook = (arg: {
    configProp: ComputedRef<BuildAnim | null>;
    getKeyframeName: ComputedRef<string>;
    animPhase: Ref<AnimPhase>;
    appear: boolean;
    emit: Emit;
    getDuration: ComputedRef<string>;
    getDelay: ComputedRef<string>;
    getEase: ComputedRef<string>;
    getSpring: ComputedRef<SpringObject>;
    propsConfig: ConfigProp;
    fragment: ComputedRef<boolean>;
    retainFinalStyle: boolean;
}) => BaseTransitionProps;
export declare type Hook = "appear" | "enter" | "leave";
export declare type DoneCallback = (cancelled?: boolean) => void;
export interface UiTransitionElement extends HTMLElement {
    __previousStyles?: DynamicObject<string | number>;
    __done?: Function;
    __animPhase?: AnimPhase;
    __animId?: number;
}
