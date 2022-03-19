import { Ref, Slots, VNode } from "vue";
import { DynamicObject } from "../../types";

export type TransitionEl = (arg: {
  slots: Slots;
  data: DynamicObject<any>;
  inProgress?: Ref<boolean>;
}) => VNode;
