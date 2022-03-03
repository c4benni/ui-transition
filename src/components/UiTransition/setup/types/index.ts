import { Slots, VNode } from "vue";
import { DynamicObject } from "../../types";

export type TransitionEl = (arg: {
  slots: Slots;
  data: DynamicObject<any>;
}) => VNode;
