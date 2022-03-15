import { ComputedRef, Ref, RendererElement } from "vue";
import { AnimPhase, BuildAnim, Emit } from "../../../types";
import { Hook } from "../types";
export default function animStart(e: RendererElement, done: (cancelled?: boolean) => void, hook: Hook, emit: Emit, animPhase: Ref<AnimPhase>, configProp: ComputedRef<BuildAnim | null>, getKeyframeName: ComputedRef<string>, getDuration: ComputedRef<string>): void;
