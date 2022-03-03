import { RendererElement } from "vue";
import { Emit } from "../../../types";
import { Hook } from "../types";
import { $emit } from "../utils";

export default function animcancelled(
  el: RendererElement,
  hook: Hook,
  emit: Emit
) {
  $emit(emit, `${hook}Cancelled`, [el]);
}
