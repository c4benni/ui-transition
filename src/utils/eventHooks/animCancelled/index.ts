import { RendererElement } from "vue";
import { Hook } from "../types";
import { resetEl } from "../utils";

export default function animCancelled(el: RendererElement, hook: Hook) {
  resetEl(el);
  console.log(el);
}
