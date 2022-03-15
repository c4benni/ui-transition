import { AnimPhase, BuildAnim, ConfigProp, Step } from "../../types";

import transitions from "../../state/transitions";

export default function extractConfig(
  configProp: ConfigProp,
  animPhase: AnimPhase
): BuildAnim {
  if (!configProp) {
    return {
      frame: () => ({}),
      duration: 0,
      delay: 0,
    };
  }

  const defaults = {
    frame: (step: Step, phase: AnimPhase) => {
      const build = {
        enter: {
          opacity: `${step(0, 1)}`,
          willChange: "opacity",
        },

        leave: {
          opacity: `${step(1, 0)}`,
          willChange: "opacity",
        },
      };

      return build[phase];
    },
  };

  if (typeof configProp == "string" && configProp) {
    // string with args e.g fade(0, 1)
    const argsRegExp = /\(.+\)$/g;

    const savedPath = configProp.replace(argsRegExp, "");

    const savedAnim = transitions[savedPath];

    if (!savedAnim) {
      return defaults;
    }

    // call savedAnim if it exists, passing any args that configProp holds;
    const extractStringArgs = (): any[] => {
      // if string has no arguments i.e no `( ... )`
      if (!argsRegExp.test(configProp)) {
        return [];
      }

      let args = configProp.match(argsRegExp) as unknown as string;

      // if no args found
      if (!args) {
        return [];
      }

      args = args[0].replace(/^\(/, "[").replace(/\)$/, "]");

      const parseArray = new Function(
        `try{return [${args}].flat()}catch(e){console.error(e)}`
      );

      return parseArray() as unknown as any[];
    };

    const output = savedAnim(...extractStringArgs());

    return {
      ...defaults,
      ...output,
    };
  }

  // extends can only happen here.
  if (typeof configProp === "object") {
    const extendConfig = configProp.extends;

    const extended = typeof extendConfig === "string" && !!extendConfig;

    let extendedConfig = {};

    // extend the config
    if (extended) {
      extendedConfig = extractConfig(configProp.extends || "", animPhase);
    }

    let currentAnimPhase = {};

    if (typeof configProp[animPhase] !== "undefined") {
      currentAnimPhase = extractConfig(configProp[animPhase] || "", animPhase);
    }

    return {
      ...defaults,
      ...extendedConfig,
      ...configProp,
      ...currentAnimPhase,
    };
  }

  return defaults;
}
