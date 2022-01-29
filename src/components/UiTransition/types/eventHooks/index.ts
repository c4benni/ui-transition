import { BaseTransitionProps, ComputedRef, Ref, RendererElement } from "vue";
import { ConfigDirection } from "../props/config";
import { AnimState, DynamicObject, Emit } from "../utils";

export type EventHook = (arg: {
  configProp: ComputedRef<ConfigDirection | null>;
  keyframes: DynamicObject<number>;
  getKeyframeName: ComputedRef<string>;
  styleId: string;
  animState: Ref<AnimState>;
  appear: boolean;
  emit: Emit;
}) => BaseTransitionProps;

export type Hook = "appear" | "enter" | "leave";

export type DoneCallback = (cancelled?: boolean) => void;
