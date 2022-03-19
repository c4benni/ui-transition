import { DynamicObject } from "src/types";
import { CalcSpring } from "./type";

const saved: DynamicObject<number[]> = {};

const calcSpring: CalcSpring = (arg = {}) => {
  const {
    tension = 320,
    friction = 25,
    mass = 1,
    precision = 0.01,
    velocity = 0,
    stopAttempt = 20,
  } = arg;

  // path to save this `createSpring` call, to avoid repetition
  const savePath = `${tension}~${friction}~${mass}~${precision}~${stopAttempt}~${velocity}`;

  if (saved?.[savePath]) {
    return Promise.resolve(saved[savePath]);
  }

  //   get springs from 0 to 1;
  //   then interpolate it with any other value(s)
  let current = 0;

  const to = 1;

  // initial velocity
  let _velocity = velocity;

  //   frames created; on every change in the `current` position, a new frame is created
  let frames = 0;

  //   `halt` holds how many times the difference between the current spring and previous spring is <= the `precision`.
  //   This means having a higher precision (closer to 1) will result in a very short spring. While having a lower precision (closer to 0) will result in a smoother, but longer spring.
  let halt = 0;

  //   `stoppingAttempt` is how many times the spring should halt (check `halt` above), before it comes to a stop. This means if you need the final moments of the spring to go back and forth a few times, use a smaller number (> 0). But if you need a fine tuned spring ending, use a higher `stoppingAttempt`.
  const stoppingAttempt = Math.max(Math.abs(stopAttempt), 1) || 5;

  //   `positions` holds an array of spring values. Each item in this array is considered a frame.
  const positions: number[] = [];

  //   to achieve 60fps. This shouldn't be changed. However, reducing the frames to say 1/30 will result in a choppy looking spring (not smooth). While increasing it eg (1/120) will make the spring unnecessarily long with no visible difference from the 1/60 frames.
  const FPS = 1 / 60;

  const maxFrames = Math.floor(FPS * 1000 * 1000);

  for (let step = 0; step <= maxFrames; step += 1) {
    const springForce = -tension * (current - to);

    const frictionForce = -friction * _velocity;

    const acceleration = (springForce + frictionForce) / mass;

    _velocity += acceleration * FPS;

    const nextValue = current + _velocity * FPS;

    const stopping = Math.abs(nextValue - current) < Math.abs(precision);

    if (stopping) {
      halt += 1;
    } else halt = 0;

    if (halt >= stoppingAttempt) {
      positions.push(to);
      frames = step + 1;
      break;
    }

    current = nextValue;

    if (step == 0) {
      positions.push(0);
    }

    positions.push(current);
  }

  if (frames == 0) {
    frames = 1000;
    positions.push(to);
  }

  //   save results to avoid repetition
  return Promise.resolve((saved[savePath] = positions));
};

export default calcSpring;
