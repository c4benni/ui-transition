import { PropType } from "vue";
import { ConfigProp } from "../types";
import { DurationAndDelay, Ease, Mode, Spring } from "./types";
declare const _default: {
    css: {
        type: BooleanConstructor;
        default: boolean | undefined;
    };
    appear: {
        type: BooleanConstructor;
        default: boolean | undefined;
    };
    tag: {
        type: StringConstructor;
        default: string | undefined;
    };
    enterFromClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    enterActiveClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    enterToClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    appearFromClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    appearActiveClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    appearToClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    leaveFromClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    leaveActiveClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    leaveToClass: {
        type: StringConstructor;
        default: string | undefined;
    };
    moveClass: {
        type: StringConstructor;
        default: boolean | undefined;
    };
    config: {
        type: PropType<ConfigProp>;
        default: ConfigProp | undefined;
    };
    delay: {
        type: PropType<DurationAndDelay>;
        default: DurationAndDelay;
    };
    duration: {
        type: PropType<DurationAndDelay>;
        default: DurationAndDelay;
    };
    ease: {
        type: PropType<Ease>;
        default: Ease | undefined;
    };
    group: {
        type: BooleanConstructor;
        default: boolean | undefined;
    };
    mode: {
        type: PropType<Mode>;
        default: Mode;
    };
    spring: {
        type: PropType<Spring>;
        default: Spring | undefined;
    };
    retainFinalStyle: {
        type: BooleanConstructor;
        default: boolean | undefined;
    };
};
export default _default;
