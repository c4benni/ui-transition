import { AddSpring, SpringPreset } from "./types";

const springPreset: SpringPreset = {
  default: {
    tension: 320,
    friction: 25,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 20,
  },

  wobbly: {
    tension: 180,
    friction: 12,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 30,
  },

  jello: {
    tension: 220,
    friction: 6,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 50,
  },

  gentle: {
    tension: 120,
    friction: 14,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 20,
  },

  stiff: {
    tension: 160,
    friction: 20,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 20,
  },

  slow: {
    tension: 280,
    friction: 60,
    mass: 1,
    precision: 0.001,
    velocity: 0,
    stopAttempt: 25,
  },
};

export default springPreset;

export function addSpring(name: string, config: AddSpring): void {
  let extended = {};

  if (typeof config.extends === "string" && springPreset[config.extends]) {
    extended = springPreset[config.extends];
  }

  delete config.extends;

  springPreset[name] = {
    ...extended,
    ...config,
  };
}
