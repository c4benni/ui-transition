import { Ref, RendererElement } from "vue";
import { AnimPhase, DynamicObject, Emit } from "../../types";
import { Hook } from "./types";
export declare const setProperties: (el: HTMLElement, styleProps: DynamicObject<string | number | undefined>) => void;
export declare const toggleAnimEvents: (action: "add" | "remove", el: HTMLElement | null, callback: (evt: AnimationEvent) => void) => void;
export declare const getState: (hook: Hook) => AnimPhase;
export declare const setAnimState: (arg: AnimPhase, animPhase: Ref<string>) => AnimPhase;
export declare const $emit: (emit: Emit, evt: string, args: any[]) => void;
export declare function resetEl(e: RendererElement): void;
