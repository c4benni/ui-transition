import { BaseTransitionProps, ComputedRef, Ref } from "vue";
import { SpringObject } from "../../props/types";
import { AnimPhase, AnimType, BuildAnim, DynamicObject } from "../../types";

export type EventHook = (arg: {
  configProp: ComputedRef<BuildAnim | null>;
  getKeyframeName: ComputedRef<string>;
  animPhase: Ref<AnimPhase>;
  appear: boolean;
  getDuration: ComputedRef<string>;
  getDelay: ComputedRef<string>;
  getEase: ComputedRef<string>;
  getSpring: ComputedRef<SpringObject>;
  fragment: ComputedRef<boolean>;
  retainFinalStyle: boolean;
  inProgress: Ref<boolean>;
  getType: ComputedRef<AnimType>;
}) => BaseTransitionProps;

export type Hook = "appear" | "enter" | "leave";

export type DoneCallback = (cancelled?: boolean) => void;

export interface UiTransitionElement extends HTMLElement {
  __previousStyles?: DynamicObject<string | number>;
  __done?: Function;
  __animPhase?: AnimPhase;
  __animId?: number;
  __anim?: Animation;
}
