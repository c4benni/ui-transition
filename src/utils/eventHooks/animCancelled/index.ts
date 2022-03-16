import { RendererElement } from "vue";
import { Hook } from "../types";
import { resetEl } from "../utils";

export default function animcancelled(el: RendererElement, hook: Hook) {
  resetEl(el);
}
