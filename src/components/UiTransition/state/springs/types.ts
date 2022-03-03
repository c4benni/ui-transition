import { SpringObject, SpringPath } from "../../props/types";

export type SpringPreset = {
  [key in SpringPath]: SpringObject;
};
