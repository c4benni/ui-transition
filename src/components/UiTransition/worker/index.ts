import { BuildAnim, DynamicObject } from "../types";

declare global {
  interface Window {
    createSpring?: () => number[];
    saved: DynamicObject<any>;
    transitions: DynamicObject<(...args: any[]) => BuildAnim>;
    methods: DynamicObject<any>;
  }
}

const worker = function () {
  self.addEventListener(
    "message",
    async (e) => {
      const {
        data: eventData,
        data: { name, uid, type, data },
      } = e;

      //   only process calls with a correct name
      if (name === "uit") {
        //   helper function to post messages
        //   sends back the `uid` the current event recieves to keep track.
        const post = (data: any) =>
          self.postMessage({
            uid,
            data,
          });

        //   handle `sleep` requests
        if (type === "sleep") {
          const { duration } = data;

          // use setTimeout if there's a duration. Else resolve an empty promise to mimic `nextTick`
          if (duration) {
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
            }, duration);
          } else await Promise.resolve();

          return post(duration);
        }

        // handle addition of methods
        if (type === "addMethod") {
          if (!self.methods) {
            self.methods = {};
          }

          // loop through the methods recieved, and assign to the self.methods
          for (const key in data) {
            self.methods[key] = new Function(`return ${data[key]}`)();
          }

          return post(true);
        }

        // handle addition of transitions
        if (type === "addTransition") {
          if (!self.transitions) {
            self.transitions = {};
          }

          for (const key in data) {
            const anim = new Function(`return ${data[key]}`)();

            self.transitions[key] = anim;
          }

          return;
        }

        //   initialize `saved` object
        if (!self.saved) {
          self.saved = {};
        }

        //   handle spring requests
        if (type == "spring") {
          const { data } = eventData;

          // add the `createSpring` function to the global instance of the worker.
          !self.createSpring &&
            (self.createSpring = (): number[] => {
              const {
                tension = 170,
                friction = 26,
                mass = 1,
                precision = 0.01,
                velocity = 0,
                stopAttempt = 5,
              } = data.config || {};

              //   path to save this `createSpring` call, to avoid repetition
              const savePath =
                `${tension}-${friction}-${mass}-${precision}-${stopAttempt}-${velocity}`.replace(
                  /\./g,
                  "-"
                );

              if (self.saved?.[savePath]) {
                return self.saved[savePath];
              }

              //   get springs from 0 to 1;
              //   then interpolate it with any other value(s)
              let current = 0;

              const to = 1;

              //   initial velocity
              let _velocity = 0;

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

              //   loop through 1000 times to create at most 1000 frames.
              for (let step = 0; step <= 1000; step += 1) {
                const springForce = -tension * (current - to);

                const frictionForce = -friction * _velocity;

                const acceleration = (springForce + frictionForce) / mass;

                _velocity += acceleration * FPS;

                const nextValue = current + _velocity * FPS;

                const stopping =
                  Math.abs(nextValue - current) <= Math.abs(precision);

                if (stopping) {
                  halt += 1;
                }

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
              return (self.saved[savePath] = positions);
            });

          const springValues = self.createSpring();

          // create a path to hold the current values the spring will be created from.
          const savePath = `${JSON.stringify(data)}`;

          if (self.saved[savePath]) {
            return post(self.saved[savePath]);
          }

          const getFrame = self.methods.extractConfig(
            data.buildAnim,
            data.animPhase
          ).frame;

          const stepper = (from: number, to: number, frame: number) =>
            (from - to) * frame + to;

          // interpolate values with `springValues`
          const getReturnFunction = getFrame;

          const calculateSteps = (
            from: number | number[],
            to: number | number[],
            frame: number
          ) => {
            const fromArray = Array.isArray(from);
            const toArray = Array.isArray(to);

            if (fromArray || toArray) {
              // check if they are same length; else bail
              if (fromArray && toArray) {
                if (from.length !== to.length) {
                  return [];
                }

                const steps = [];

                for (let index = 0; index < from.length; index++) {
                  steps.push(stepper(to[index], from[index], frame));
                }

                return steps;
              }

              return [];
            } else {
              return stepper(to, from, frame);
            }
          };

          const springs = springValues.map((frame) => {
            const val = getReturnFunction(
              (from: number | number[], to: number | number[]) =>
                calculateSteps(from, to, frame),
              data.animPhase
            );

            return val;
          });

          let duration;

          // set duration if client is trying to create keyframes
          duration = (springValues.length / 60) * 1000;

          // create keyframes
          if (!data.waapi) {
            let cssText = `@keyframes ${data.keyframeName}{`;

            // helper to get the current frame index (keyframe %)
            const frameIndex = (length: number, index: number): number =>
              (100 / length) * index;

            const kebabCase = (arg: string) =>
              arg.replace(/[A-Z]/g, (letter) => `-${letter}`.toLowerCase());

            for (let index = 0; index < springs.length; index++) {
              const getFrameIndex = `${frameIndex(springs.length - 1, index)}%`;

              cssText += `${getFrameIndex}{`;

              for (const key in springs[index]) {
                cssText += `${kebabCase(key)}:${springs[index][key]};`;
              }

              cssText += `}`;
            }

            cssText += "}";

            return post(
              (self.saved[savePath] = {
                cssText,
                duration,
              })
            );
          } else {
            return post(
              (self.saved[savePath] = {
                cssText: springs,
                duration,
              })
            );
          }
        }
      }
    },
    { passive: true }
  );
};

export default worker.toString().replace(/^function\s?\(\)\s?{|\}$/g, "");
