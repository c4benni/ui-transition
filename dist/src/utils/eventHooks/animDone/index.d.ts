import { ComputedRef, Ref, RendererElement } from "vue";
import { AnimPhase, BuildAnim, Emit } from "../../../types";
import { Hook } from "../types";
export default function animDone(e: RendererElement, hook: Hook, emit: Emit, animPhase: Ref<AnimPhase>, configProp: ComputedRef<BuildAnim | null>, retainFinalStyle: boolean): void;
