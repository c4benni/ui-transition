import { EaseConfig } from "../ease";
import { SpringConfig } from "../spring";

export interface ConfigTransition {
  transform?: string;
  opacity?: string;
}

export interface ConfigDefaults {
  duration?: number;
  delay?: number;
  origin?: string;
  ease?: EaseConfig;
  spring?: SpringConfig;
}

export interface ConfigDirection extends ConfigDefaults {
  from?: ConfigTransition;
  to?: ConfigTransition;
}

export interface ConfigAsObject extends ConfigDefaults {
  enter?: ConfigDirection;
  leave?: ConfigDirection;
}

export type GenericConfigProp = string | ConfigAsObject;

export type ConfigProp = boolean | GenericConfigProp | GenericConfigProp[];
