import {
  ConfigAsObject,
  ConfigDirection,
  ConfigProp,
} from "../types/props/config";
import { AnimState } from "../types/utils";
import { uiAnimations } from "./config";

// helper function to add enter and leave to
// animConfigs that have only from and to
// animConfigs with only from and to will be
// treated as enter state, then reversed as leave.
const parseEnterAndLeave = (
  arg: ConfigAsObject | undefined
): ConfigAsObject => {
  if (!arg) return {};

  const output = { ...arg };

  output.enter = {
    from: arg.from,
    to: arg.to,
    ...arg.enter,
  };

  output.leave = {
    from: arg.to,
    to: arg.from,
    ...arg.leave,
  };

  if (arg.enter && arg.leave) {
    return arg;
  }

  return output;
};

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
    // string with args eg fade(0,1)
    const argsRegExp = /\(.+\)$/g;

    const savedAnim = uiAnimations.value[configProp.replace(argsRegExp, "")];

    if (!savedAnim) {
      return defaults;
    }

    // call savedAnim if it exists, passing any args that configProp holds;

    const extractStringArgs = (): any[] => {
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

    const output = parseEnterAndLeave(savedAnim(...extractStringArgs()));

    return {
      ...defaults,
      ...output,
      ...output[animState],
    };
  }

  if (typeof configProp == "object" && !Array.isArray(configProp)) {
    const output = parseEnterAndLeave(configProp);

    return {
      ...defaults,
      ...output,
      ...output[animState],
    };
  }

  if (Array.isArray(configProp)) {
    return extractConfig(configProp, animState);
  }

  return defaults;
}
