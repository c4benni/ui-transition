import { GlobalState } from "../state/types";

export const initGlobalState: GlobalState = {
  init: false,
  webWorker: null,
  styleId: "",
  styleCreated: false,
  keyframes: {},
};

export function kebabCase(arg: string): string {
  return arg
    .replace(/[A-Z]/g, (letter) => `-${letter}`.toLowerCase())
    .replace(/^-/, "");
}

export function pascalCase(arg: string): string {
  return arg
    .replace(/\w/, (x) => x.toUpperCase())
    .replace(/-\w/g, (x) => `${x[1]}`.toUpperCase());
}
