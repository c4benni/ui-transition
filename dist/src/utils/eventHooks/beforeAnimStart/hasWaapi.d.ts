import { DynamicObject } from "../../../types";
import { UiTransitionElement } from "../types";
export default function hasWaapi(createSpring: () => Promise<DynamicObject<any>>, getDuration: string, el: UiTransitionElement, getEase: string, delay: number, resetPreviousStyles: () => void, lastFrame: DynamicObject<string | number>): void;
