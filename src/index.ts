import { App } from "vue";
import getSpring from "./worker/getSpring";
import { options } from "./defaults";
import UiTransition from "./index.vue";
import { InstallOptions } from "./types";
import { addSpring } from "./state/springs";
import { addTransition } from "./state/transitions";
import { DynamicObject } from "./types";
import { kebabCase, pascalCase } from "./utils";
import sleep from "./worker/sleep";

let installed = false;

export default function install(app: App, config: InstallOptions = {}) {
  if (installed) return;

  let { componentName = options.componentName, globals } = config;

  if (typeof globals === "undefined") {
    globals = options.globals;
  }

  // set component name
  if (componentName) {
    options.componentName = componentName;
  }

  // set globals, expand any possible object, and set options as a object[]
  if (globals) {
    const globalValues: DynamicObject<any>[] = [];

    const validGlobals = ["sleep", "getSpring"];

    for (const item of globals) {
      if (typeof item === "string" && validGlobals.includes(item)) {
        globalValues.push({
          [item]: item,
        });
      }

      // for scenarios like { getSpring: "somethingElse" }
      if (typeof item === "object") {
        for (const key in item) {
          // check if the key exists
          if (typeof item[key] === "string" && validGlobals.includes(key)) {
            globalValues.push(item);
          }
        }
      }
    }

    options.globals = globalValues;
  }

  if (config.props) {
    for (const key in config.props) {
      // @ts-ignore
      UiTransition.props[key].default = config.props[key];
    }
  }

  if (config.springPreset) {
    for (const key in config.springPreset) {
      addSpring(key, config.springPreset[key]);
    }
  }

  if (config.transitions) {
    for (const key in config.transitions) {
      addTransition(key, config.transitions[key]);
    }
  }

  if (options.globals) {
    // store available globals for quick lookup.
    // options.globals returns object[] with keys matching the available globals, and values matching what the global value should be.
    // E.g {sleep: "somethingElse"}
    const availableGlobals: DynamicObject<Function> = {
      sleep,
      getSpring,
    };

    const setGlobalValue = (obj: DynamicObject<string>) => {
      for (const [_key, _value] of Object.entries(obj)) {
        const key = `$${_value}`;

        const value = availableGlobals[_key];

        if (value) {
          app.provide(key, value);
          app.config.globalProperties[key] = value;
        }
      }
    };

    for (const value of options.globals as DynamicObject<string>[]) {
      setGlobalValue(value);
    }
  }

  const cName = options.componentName || "UiTransition";

  app.component(pascalCase(cName), UiTransition);

  app.component(kebabCase(cName), UiTransition);

  installed = true;
}
