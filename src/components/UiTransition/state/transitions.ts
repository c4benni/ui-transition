import { reactive } from "vue";
import { DynamicObject } from "../../UiTransition/types/utils";
import { BuildAnim } from "../types";

const transitions = reactive<DynamicObject<(args?: []) => BuildAnim>>({});

export default transitions;
