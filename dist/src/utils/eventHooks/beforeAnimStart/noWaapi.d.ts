import { DynamicObject } from "../../../types";
import { UiTransitionElement } from "../types";
export default function noWaapi(getKeyframeName: string, createSpring: () => Promise<DynamicObject<any>>, el: UiTransitionElement, resetPreviousStyles: () => void, ease: string): void;
