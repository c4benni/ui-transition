import { GlobalState } from "../types";

export const initGlobalState: GlobalState = {
  init: false,
  waapi: false,
  webWorker: null,
  styleId: "",
  styleCreated: false,
};

export function kebabCase(arg: string): string {
  return arg.replace(/[A-Z]/g, (letter) => `-${letter}`.toLowerCase());
}
