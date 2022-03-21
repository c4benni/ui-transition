import { App } from "vue";
import { options } from "./defaults";
import UiTransition from "./index.vue";
import { InstallOptions } from "./types";
import { addSpring } from "./state/springs";
import { addTransition } from "./state/transitions";
import { DynamicObject } from "./types";
import { kebabCase, pascalCase } from "./utils";
import getSpring from "./getAnimation/inject";

let installed = false;

export default function install(app: App, config: InstallOptions = {}) {
  if (installed) return;

  let { componentName = options.componentName, inject } = config;

  if (typeof inject === "undefined") {
    inject = options.inject;
  }

  // set component name
  if (componentName) {
    options.componentName = componentName;
  }

  // set inject, expand any possible object, and set options as a object[]
  if (inject) {
    const globalValues: DynamicObject<any>[] = [];

    const validinject = ["sleep", "getSpring"];

    for (const item of inject) {
      if (typeof item === "string" && validinject.includes(item)) {
        globalValues.push({
          [item]: item,
        });
      }

      // for scenarios like { getSpring: "somethingElse" }
      if (typeof item === "object") {
        for (const key in item) {
          // check if the key exists
          if (typeof item[key] === "string" && validinject.includes(key)) {
            globalValues.push(item);
          }
        }
      }
    }

    options.inject = globalValues;
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

  if (options.inject) {
    // store available inject for quick lookup.
    // options.inject returns object[] with keys matching the available inject, and values matching what the global value should be.
    // E.g {sleep: "somethingElse"}
    const availableinject: DynamicObject<Function> = {
      getSpring,
    };

    const setGlobalValue = (obj: DynamicObject<string>) => {
      for (const [_key, _value] of Object.entries(obj)) {
        const key = `$${_value}`;

        const value = availableinject[_key];

        if (value) {
          app.provide(key, value);
          app.config.globalProperties[key] = value;
        }
      }
    };

    for (const value of options.inject as DynamicObject<string>[]) {
      setGlobalValue(value);
    }
  }

  const cName = options.componentName || "UiTransition";

  app.component(pascalCase(cName), UiTransition);

  app.component(kebabCase(cName), UiTransition);

  installed = true;
}
