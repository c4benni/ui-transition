import {
  CreateSpring,
  GetCSS,
  GetMustache,
  Interpolate,
  MatchAndReplace,
  Mustache,
  ParseKeyFrames,
} from "../types/worker";
import { MessageData } from "../types/worker";
import { Progress } from "../types/utils";
declare global {
  interface Window {
    createSpring?: (arg: CreateSpring) => number[];
    saved: {
      [key: string]: any;
    };
  }
}

const worker = function () {
  self.addEventListener(
    "message",
    async (e) => {
      if (e.data?.name === "uit") {
        const post = (data: any) =>
          self.postMessage({
            uid: e.data.uid,
            data,
          });

        if (e.data.type === "sleep") {
          const timeout = setTimeout(() => {
            post(e.data.data.duration || 1);
            clearTimeout(timeout);
          }, e.data.data.duration || 0);
          return;
        }

        if (!self.saved) {
          self.saved = {};
        }

        if (e.data?.type == "spring") {
          const springAnimation =
            self.createSpring ||
            (self.createSpring = ({
              tension = 180,
              friction = 12,
              mass = 1,
              precision = 0.0001,
              velocity = 0,
              stopAttempt = 5,
            } = {}): number[] => {
              const savePath =
                `${tension}-${friction}-${mass}-${precision}-${stopAttempt}-${velocity}`.replace(
                  /\./g,
                  "-"
                );

              if (self.saved?.[savePath]) {
                return self.saved[savePath];
              }

              let current = 0;
              const to = 1;

              let _velocity = 0;
              let frames = 0;
              let halt = 0;
              const positions: number[] = [];
              const stoppingAttempt = Math.max(Math.abs(stopAttempt), 1) || 5;

              const FPS = 1 / 60;

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

              return (self.saved[savePath] = positions);
            });

          const springValues = springAnimation(
            e.data.parse
              ? e.data?.data?.spring || {}
              : typeof e.data === "object"
              ? e.data
              : {}
          );

          if (e.data.parse) {
            const mustacheRegExp = /(\{-?(?:\d+?\.?)?\d+(?:[a-zA-Z]+|%)?\})/g;

            const progress: Progress = (from, to, ratio) =>
              from + (to - from) * ratio;

            const messageData: MessageData = e.data.data;

            const getCSS = (): GetCSS => {
              const savePath = messageData?.savePath;

              if (self.saved[savePath]) {
                return self.saved[savePath] as GetCSS;
              }

              const addBrowserPropPrefix = (str: string): string =>
                `-webkit-${str}${str}`;

              const expandAndExtract = (
                from: string,
                to: string
              ): string[] | null => {
                const getMustache: GetMustache = () => {
                  if (typeof from != "string" || typeof to != "string") {
                    return null;
                  }

                  // match mustaches that are valid, have either \w+ or % after \d+ and have <=1 \.;
                  const matchMustache = (
                    str: string,
                    hasUnit: boolean
                  ): Mustache[] =>
                    (str.match(mustacheRegExp) || [])
                      // remove any with > 1 dot
                      .filter((str) => !str.match(/\..\./g))
                      .map((str) => {
                        const returnValue: Mustache = {
                          value: (str.match(/-?\.?\d+(?:\.\d+)?/g) || [])[0],
                        };

                        if (hasUnit) {
                          returnValue.unit = (str.match(/(?:[a-zA-Z]+|%)/g) ||
                            [])[0];
                        }

                        return returnValue;
                      });

                  // check the to value for any mustaches, make sure it matches the same number as the from value, else bail;
                  const toMustache = matchMustache(to, true);
                  const fromMustache = matchMustache(from, false);

                  const toLength = toMustache.length;
                  const fromLength = fromMustache.length;

                  const canContinue =
                    toLength && fromLength && toLength === fromLength;

                  if (canContinue) {
                    return {
                      from: fromMustache,
                      to: toMustache,
                      originalTo: to,
                    };
                  }

                  return null;
                };

                const mustaches = getMustache();

                if (!mustaches) return null;

                const matchAndReplace: MatchAndReplace = (original, array) => {
                  //  clone array so its values can be carefully deleted;
                  const arrayClone = [...array];

                  //  split original to get mustaches; then loop and replace mustache with the first arrayClone item; shift that cloneArray item away;
                  const splitted = original.split(mustacheRegExp).map((str) => {
                    if (/^\{/.test(str)) {
                      return arrayClone.shift();
                    }
                    return str;
                  });

                  // join splitted values back and return
                  return splitted.join("");
                };

                const interpolate: Interpolate = (spring) => {
                  // this fn takes in (from&&to)={value:string,unit:string} and matches it using the spring array;
                  // will return a 2d string[] based on the length of `to`; the unit of `to` will then be suffixed; output = value+unit(row) by frames(col)
                  const returnValue = [];

                  const fromMustache = mustaches.from;
                  const toMustache = mustaches.to;
                  const originalTo = mustaches.originalTo;

                  // loop the spring to get each frame;
                  for (const frame of spring) {
                    // hold the current frame's value+unit;
                    const currentFrame = [];
                    // loop the to value to get the value+unit using progress();
                    for (
                      let toIndex = 0;
                      toIndex < toMustache.length;
                      toIndex++
                    ) {
                      currentFrame.push(
                        `${progress(
                          parseFloat(fromMustache[toIndex].value),
                          parseFloat(toMustache[toIndex].value),
                          frame
                        )}${toMustache[toIndex].unit || ""}`
                      );
                    }

                    returnValue.push(matchAndReplace(originalTo, currentFrame));
                  }

                  return returnValue;
                };

                return interpolate(springValues);
              };

              const transform = expandAndExtract(
                messageData.from?.transform || "",
                messageData.to?.transform || ""
              );

              const opacity = expandAndExtract(
                messageData.from?.opacity || "",
                messageData.to?.opacity || ""
              );

              const frameIndex = (length: number, index: number): number =>
                (100 / length) * index;

              const parseFrames: ParseKeyFrames = (Transform, Opacity) => {
                let output = "";

                const loopValue = Transform || Opacity;

                if (!loopValue) return null;

                for (let index = 0; index < loopValue.length; index++) {
                  const transform = Transform && Transform[index];
                  const opacity = Opacity && Opacity[index];
                  const getFrameIndex = `${frameIndex(
                    loopValue.length - 1,
                    index
                  )}%`;

                  output += `${getFrameIndex}{`;

                  transform &&
                    (output += addBrowserPropPrefix(`transform:${transform};`));
                  opacity && (output += `opacity:${opacity};`);

                  output += "}";
                }

                return output;
              };

              const animName = messageData?.keyframeName || "";

              const addBrowserKeyframePrefix = (str: string) =>
                `@-webkit-keyframes ${str} @keyframes ${str}`;

              const keyframes = addBrowserKeyframePrefix(
                `${animName}{${parseFrames(transform, opacity)}}`
              );

              return (self.saved[savePath] = {
                keyframes,
                animName,
                duration: (springValues.length / 60) * 1000,
              });
            };

            const cssText = getCSS();

            return post({
              cssText,
            });
          }
        }
      }
    },
    { passive: true }
  );
};

export default worker.toString().replace(/^function\s?\(\)\s?{|\}$/g, "");
