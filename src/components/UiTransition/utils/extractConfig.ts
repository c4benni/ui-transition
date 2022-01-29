import { ConfigDirection, ConfigProp } from "../types/props/config";
import { AnimState } from "../types/utils";
import { uiAnimations } from "./config";

// function to extract config if it's a valid type
// (string | object | (string | object)[])
// returns accordinf to current animState
// (enter|leave)
// also adds default if they're missing
// eg spring, delay, etc.
// if (from | to) isn't present, then `configProp` is invalid,
// default will be returned;
export default function extractConfig(
  configProp: ConfigProp,
  animState: AnimState
): ConfigDirection | null {
  if (configProp === false) {
    return null;
  }

  const isEnter = animState === "enter";

  const defaults: ConfigDirection = {
    from: {
      opacity: `{${isEnter ? 0 : 1}}`,
    },
    to: {
      opacity: `{${isEnter ? 1 : 0}}`,
    },
  };

  if (typeof configProp == "string") {
    const savedAnim = uiAnimations.value[configProp];

    if (!savedAnim) {
      return defaults;
    }

    // call savedAnim if it exists, passing any args that configProp holds;

    const extractStringArgs = (): any[] => {
      // string with args eg fade(0,1)
      const argsRegExp = /\(.+\)$/g;

      if (!argsRegExp.test(configProp)) {
        return [];
      }

      let args = configProp.match(argsRegExp) as unknown as string;

      if (!args) {
        return [];
      }

      args = args[0].replace(/^\(/, "[").replace(/\)$/, "]");

      const parseArray = new Function(
        `try{return [${args}].flat()}catch(e){console.error(e)}`
      );

      return parseArray() as unknown as any[];
    };

    const output = savedAnim(...extractStringArgs())[animState];

    return {
      ...defaults,
      ...output,
    };
  }

  if (typeof configProp == "object" && !Array.isArray(configProp)) {
    return {
      ...defaults,
      ...configProp[animState],
    };
  }

  if (Array.isArray(configProp)) {
    return extractConfig(configProp, animState);
  }

  return defaults;
}
