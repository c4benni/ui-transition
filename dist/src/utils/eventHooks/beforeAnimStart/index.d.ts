import { ComputedRef, Ref, RendererElement } from "vue";
import { SpringObject } from "../../../props/types";
import { AnimPhase, BuildAnim, ConfigProp, Emit } from "../../../types";
import { Hook } from "../types";
export default function beforeAnimStart(e: RendererElement, hook: Hook, animPhase: Ref<AnimPhase>, emit: Emit, configProp: ComputedRef<BuildAnim | null>, getKeyframeName: ComputedRef<string>, getDuration: ComputedRef<string>, getDelay: ComputedRef<string>, getEase: ComputedRef<string>, getSpring: ComputedRef<SpringObject>, propsConfig: ConfigProp): void;
