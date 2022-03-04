import { SpringPreset } from "./types";

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

  gentle: {
    tension: 120,
    friction: 14,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 20,
  },

  stiff: {
    tension: 210,
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
