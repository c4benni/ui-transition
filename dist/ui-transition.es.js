var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { h, TransitionGroup as TransitionGroup$1, Transition as Transition$1, capitalize, defineComponent, ref, computed, onBeforeMount } from "vue";
const globalState = {
  init: false,
  waapi: false,
  webWorker: null,
  styleId: "",
  styleCreated: false,
  keyframes: {}
};
let calls$2 = 0;
const asyncWorker = async function({ type, data }) {
  calls$2 += 1e-4;
  const worker2 = globalState.webWorker;
  const validWorker = worker2 instanceof Worker;
  if (!validWorker) {
    return Promise.reject("Invalid worker, Please report this issue");
  }
  const uid = calls$2;
  worker2.postMessage({
    name: "uit",
    uid,
    type,
    data: data || {}
  });
  return new Promise((resolve) => {
    const callback = (e) => {
      var _a, _b;
      if (((_a = e.data) == null ? void 0 : _a.uid) === uid) {
        worker2.removeEventListener("message", callback, {
          passive: true
        });
        resolve({
          data: ((_b = e.data) == null ? void 0 : _b.data) || null
        });
      }
    };
    worker2.addEventListener("message", callback, { passive: true });
  });
};
const getSpring = async function getSpring2(frame, config) {
  const spring = await asyncWorker({
    type: "spring",
    data: {
      type: "getSpring",
      config,
      frame
    }
  });
  return spring.data;
};
const props$1 = {
  css: false,
  appear: false,
  tag: void 0,
  enterFromClass: void 0,
  enterActiveClass: void 0,
  enterToClass: void 0,
  appearFromClass: void 0,
  appearActiveClass: void 0,
  appearToClass: void 0,
  leaveFromClass: void 0,
  leaveActiveClass: void 0,
  leaveToClass: void 0,
  config: "fade",
  delay: void 0,
  duration: void 0,
  ease: "linear",
  group: false,
  mode: "out-in",
  spring: "wobbly",
  retainFinalStyle: false
};
const options = {
  componentName: "UiTransition",
  globals: ["sleep", "getSpring"]
};
var props = {
  css: {
    type: Boolean,
    default: props$1.css
  },
  appear: {
    type: Boolean,
    default: props$1.appear
  },
  tag: {
    type: String,
    default: props$1.tag
  },
  enterFromClass: {
    type: String,
    default: props$1.enterFromClass
  },
  enterActiveClass: {
    type: String,
    default: props$1.enterActiveClass
  },
  enterToClass: {
    type: String,
    default: props$1.enterToClass
  },
  appearFromClass: {
    type: String,
    default: props$1.appearFromClass
  },
  appearActiveClass: {
    type: String,
    default: props$1.appearActiveClass
  },
  appearToClass: {
    type: String,
    default: props$1.appearToClass
  },
  leaveFromClass: {
    type: String,
    default: props$1.leaveFromClass
  },
  leaveActiveClass: {
    type: String,
    default: props$1.leaveActiveClass
  },
  leaveToClass: {
    type: String,
    default: props$1.leaveToClass
  },
  moveClass: {
    type: String,
    default: props$1.moveClass
  },
  config: {
    type: [String, Object],
    default: props$1.config
  },
  delay: {
    type: [Number, Object],
    default: props$1.delay
  },
  duration: {
    type: [Number, Object],
    default: props$1.duration
  },
  ease: {
    type: [String, Object],
    default: props$1.ease
  },
  group: {
    type: Boolean,
    default: props$1.group
  },
  mode: {
    type: String,
    default: props$1.mode
  },
  spring: {
    type: [String, Object],
    default: props$1.spring
  },
  retainFinalStyle: {
    type: Boolean,
    default: props$1.retainFinalStyle
  }
};
const TransitionGroup = function({ slots, data }) {
  return h(TransitionGroup$1, data, {
    default: () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    }
  });
};
const Transition = function({ slots, data }) {
  return h(Transition$1, data, {
    default: () => {
      var _a, _b;
      return (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0];
    }
  });
};
const worker = function() {
  self.__spreadValues = Object.assign;
  self.addEventListener("message", async (e) => {
    const { data: eventData, data: { name, uid, type, data } } = e;
    try {
      if (name === "uit") {
        const post = (data2) => self.postMessage({
          uid,
          data: data2
        });
        if (type === "sleep") {
          const { duration } = data;
          if (duration) {
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
            }, duration);
          } else
            await Promise.resolve();
          return post(duration);
        }
        if (type === "addMethod") {
          if (!self.methods) {
            self.methods = {};
          }
          for (const key in data) {
            self.methods[key] = new Function(`return ${data[key]}`)();
          }
          return post(true);
        }
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
        if (!self.saved) {
          self.saved = {};
        }
        if (type == "spring") {
          const { data: data2 } = eventData;
          const createSpring = () => {
            var _a;
            const { tension = 320, friction = 25, mass = 1, precision = 0.01, velocity = 0, stopAttempt = 20 } = data2.config || {};
            const savePath2 = `${tension}-${friction}-${mass}-${precision}-${stopAttempt}-${velocity}`.replace(/\./g, "-");
            if ((_a = self.saved) == null ? void 0 : _a[savePath2]) {
              return self.saved[savePath2];
            }
            let current = 0;
            const to = 1;
            let _velocity = velocity;
            let frames = 0;
            let halt = 0;
            const stoppingAttempt = Math.max(Math.abs(stopAttempt), 1) || 5;
            const positions = [];
            const FPS = 1 / 60;
            const maxFrames = Math.floor(FPS * 1e3 * 1e3);
            for (let step = 0; step <= maxFrames; step += 1) {
              const springForce = -tension * (current - to);
              const frictionForce = -friction * _velocity;
              const acceleration = (springForce + frictionForce) / mass;
              _velocity += acceleration * FPS;
              const nextValue = current + _velocity * FPS;
              const stopping = Math.abs(nextValue - current) < Math.abs(precision);
              if (stopping) {
                halt += 1;
              } else
                halt = 0;
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
              frames = 1e3;
              positions.push(to);
            }
            return self.saved[savePath2] = positions;
          };
          const springValues = createSpring();
          const savePath = `${JSON.stringify(data2)}`;
          if (self.saved[savePath]) {
            return post(self.saved[savePath]);
          }
          const stepper = (from, to, frame) => (from - to) * frame + to;
          const calculateSteps = (from, to, frame) => {
            const fromArray = Array.isArray(from);
            const toArray = Array.isArray(to);
            if (fromArray || toArray) {
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
          if (data2.type === "getSpring") {
            const { frame } = data2;
            if (Array.isArray(frame) && frame.length) {
              const is2d = Array.isArray(frame[0]);
              const frameAs2d = is2d ? frame : [[frame[0] || 0, frame[1] || 0]];
              const output = [];
              frameAs2d.forEach((row) => {
                const values = [];
                springValues.forEach((spring) => {
                  values.push(calculateSteps(row[0], row[1], spring));
                });
                if (is2d) {
                  output.push([values]);
                } else {
                  output.push(values);
                }
              });
              return post(output);
            }
            return post([]);
          }
          const getFrame = self.methods.extractConfig(data2.buildAnim, data2.animPhase).frame;
          const getReturnFunction = typeof getFrame === "string" ? new Function(`return ${getFrame}`)() : getFrame;
          const springs = springValues.map((frame) => {
            const val = getReturnFunction((from, to) => calculateSteps(from, to, frame), data2.animPhase);
            return val;
          });
          let duration;
          duration = springValues.length / 60 * 1e3;
          if (!data2.waapi) {
            let cssText = `@keyframes ${data2.keyframeName}{`;
            const frameIndex = (length, index) => 100 / length * index;
            const kebabCase2 = (arg) => arg.replace(/[A-Z]/g, (letter) => `-${letter}`.toLowerCase());
            for (let index = 0; index < springs.length; index++) {
              const getFrameIndex = `${frameIndex(springs.length - 1, index)}%`;
              cssText += `${getFrameIndex}{`;
              for (const key in springs[index]) {
                cssText += `${kebabCase2(key)}:${springs[index][key]};`;
              }
              cssText += `}`;
            }
            cssText += "}";
            return post(self.saved[savePath] = {
              cssText,
              duration
            });
          } else {
            return post(self.saved[savePath] = {
              cssText: springs,
              duration
            });
          }
        }
      }
    } catch (err) {
      if (err) {
        const { buildAnim } = e.data.data;
        console.error(`<UiTransition />: Your configurations might have some issues. Please check the following configuration.`);
        console.groupCollapsed("<UiTransition />: Configuration", ``);
        console.group(/string|boolean/.test(typeof buildAnim) ? buildAnim : JSON.stringify(buildAnim));
        console.groupEnd();
      }
    }
  }, { passive: true });
};
var workerString = worker.toString().replace(/^function\s?\(\)\s?{|\}$/g, "");
function createWorker() {
  const blob = new Blob([workerString], {
    type: "text/javascript"
  });
  const url = window.URL.createObjectURL(blob);
  return new Worker(url, {
    name: "ui-transition-worker",
    credentials: "same-origin"
  });
}
function updateWorkerTransition(transitions2) {
  if (!globalState.webWorker) {
    return;
  }
  const parsedTransitions = {};
  for (const key in transitions2) {
    parsedTransitions[key] = transitions2[key].toString();
  }
  asyncWorker({
    type: "addTransition",
    data: parsedTransitions
  });
}
let transitions = {
  fade: (from = 0, to = 1) => {
    return {
      frame: (step, phase) => {
        const build = {
          enter: {
            opacity: `${step(0, to)}`,
            transform: `scale3d(${step(from, to)}, ${step(from, to)}, 1)`
          },
          leave: {
            opacity: `${step(to, from)}`
          }
        };
        return build[phase];
      }
    };
  }
};
function addTransition(name, transition) {
  transitions[name] = transition;
  updateWorkerTransition(transitions);
}
function extractConfig(configProp, animPhase) {
  if (!configProp) {
    return {
      frame: () => ({}),
      duration: 0,
      delay: 0
    };
  }
  const defaults = {
    frame: (step, phase) => {
      const build = {
        enter: {
          opacity: `${step(0, 1)}`,
          willChange: "opacity"
        },
        leave: {
          opacity: `${step(1, 0)}`,
          willChange: "opacity"
        }
      };
      return build[phase];
    }
  };
  if (typeof configProp == "string" && configProp) {
    const argsRegExp = /\(.+\)$/g;
    const savedPath = configProp.replace(argsRegExp, "");
    const savedAnim = transitions[savedPath];
    if (!savedAnim) {
      return defaults;
    }
    const extractStringArgs = () => {
      if (!argsRegExp.test(configProp)) {
        return [];
      }
      let args = configProp.match(argsRegExp);
      if (!args) {
        return [];
      }
      args = args[0].replace(/^\(/, "[").replace(/\)$/, "]");
      const parseArray = new Function(`try{return [${args}].flat()}catch(e){console.error(e)}`);
      return parseArray();
    };
    const output = savedAnim(...extractStringArgs());
    return __spreadValues(__spreadValues({}, defaults), output);
  }
  if (typeof configProp === "object") {
    const extendConfig = configProp.extends;
    const extended = typeof extendConfig === "string" && !!extendConfig;
    let extendedConfig = {};
    if (extended) {
      extendedConfig = extractConfig(configProp.extends || "", animPhase);
    }
    let currentAnimPhase = {};
    if (typeof configProp[animPhase] !== "undefined") {
      currentAnimPhase = extractConfig(configProp[animPhase] || "", animPhase);
    }
    return __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, defaults), extendedConfig), configProp), currentAnimPhase);
  }
  return defaults;
}
let styleIdCalls = -1;
const createStyleTag = () => {
  styleIdCalls += 1;
  const id = `uit-style-el-${styleIdCalls}`;
  const existingStyleEl = document.getElementById(id);
  if (existingStyleEl) {
    existingStyleEl.remove();
  }
  const style = document.createElement("style");
  style.id = id;
  style.innerText = `.ui-transition{animation-timing-function:var(--uit-ease,linear)!important;animation-delay:var(--uit-delay)!important;animation-name:var(--uit-anim-name)!important;animation-duration:var(--uit-anim-duration)!important;transition-duration:0ms!important;}`;
  (document.head || document.querySelector("head")).append(style);
  return id;
};
function beforeMount() {
  if (!globalState.init) {
    globalState.init = true;
    globalState.waapi = typeof HTMLElement.prototype.animate === "function";
    if (!globalState.waapi) {
      globalState.styleId = createStyleTag();
    }
    if (!globalState.webWorker) {
      globalState.webWorker = createWorker();
      asyncWorker({
        type: "addMethod",
        data: {
          extractConfig: extractConfig.toString()
        }
      });
      updateWorkerTransition(transitions);
    }
  }
}
const parsedStrings = {};
function keyframeName(config, spring, animPhase) {
  const configString = JSON.stringify(__spreadProps(__spreadValues({}, config), {
    frame: config.frame.toString()
  }));
  const springString = JSON.stringify(spring);
  const encrypt = `${configString}-${springString}-${animPhase}`;
  if (parsedStrings[encrypt]) {
    return parsedStrings[encrypt];
  }
  return parsedStrings[encrypt] = `uitKF-${animPhase}-${performance.now().toString(36).replace(/\./g, "-")}`;
}
function kebabCase(arg) {
  return arg.replace(/[A-Z]/g, (letter) => `-${letter}`.toLowerCase()).replace(/^-/, "");
}
function pascalCase(arg) {
  return arg.replace(/\w/, (x) => x.toUpperCase()).replace(/-\w/g, (x) => `${x[1]}`.toUpperCase());
}
const setProperties = (el, styleProps) => {
  for (const key in styleProps) {
    const value = styleProps[key];
    if (typeof value != "undefined") {
      el.style.setProperty(key, `${value}`);
    }
  }
};
const toggleAnimEvents = (action, el, callback) => {
  el && ["animationend", "animationcancel"].forEach((evt) => {
    el[`${action}EventListener`](evt, callback);
  });
};
const getState = (hook) => hook === "leave" ? "leave" : "enter";
const setAnimState = (arg, animPhase) => animPhase.value = arg;
const $emit = (emit, evt, args) => {
  emit(kebabCase(evt), args);
  emit(evt, args);
};
function resetEl(e) {
  const { waapi } = globalState;
  if (!waapi) {
    const el = e;
    el.classList.remove("ui-transition");
    [
      "--uit-anim-duration",
      "--uit-anim-name",
      "--uit-delay",
      "--uit-ease"
    ].forEach((prop) => {
      el.style.removeProperty(prop);
    });
  }
}
let calls$1 = 0;
function hasWaapi(createSpring, getDuration, el, getEase, delay, resetPreviousStyles, lastFrame) {
  calls$1 += 1e-4;
  const animationId = calls$1;
  createSpring().then((animObject) => {
    const { data: { cssText, duration } } = animObject;
    const animDuration = getDuration || duration;
    const anim = el.animate(cssText, {
      duration: parseFloat(animDuration),
      easing: getEase,
      delay
    });
    el.__animId = animationId;
    anim.addEventListener("finish", () => {
      var _a;
      if (el.__animId === animationId) {
        (_a = el.__done) == null ? void 0 : _a.call(el);
        resetPreviousStyles();
        delete el.__animId;
      }
    }, { once: true });
    anim.addEventListener("cancel", () => {
      var _a;
      if (el.__animId === animationId) {
        (_a = el.__done) == null ? void 0 : _a.call(el, true);
        resetPreviousStyles();
        delete el.__animId;
      }
    }, { once: true });
    if (delay) {
      requestAnimationFrame(() => {
        const timeout = setTimeout(() => {
          resetPreviousStyles();
          setProperties(el, lastFrame);
          clearTimeout(timeout);
        }, delay);
      });
    } else
      requestAnimationFrame(resetPreviousStyles);
  });
}
let calls = 0;
function noWaapi(getKeyframeName, createSpring, el, resetPreviousStyles, ease) {
  calls += 1e-4;
  const animationId = calls;
  el.__animId = animationId;
  const { styleId, keyframes } = globalState;
  setProperties(el, {
    "--uit-ease": ease
  });
  console.log(ease);
  if (!keyframes[getKeyframeName]) {
    createSpring().then((animObject) => {
      const { data: { cssText, duration } } = animObject;
      keyframes[getKeyframeName] = duration;
      const styleTag = document.getElementById(styleId);
      if (styleTag) {
        styleTag.innerText += cssText;
      }
    });
  }
  el.addEventListener("animationstart", (evt) => {
    if (evt.target === evt.currentTarget && evt.animationName === getKeyframeName && el.__animId === animationId) {
      resetPreviousStyles();
    }
  }, { once: true });
  const eventCallback = (evt) => {
    var _a;
    if (evt.target === evt.currentTarget && evt.animationName === getKeyframeName) {
      if (el.__animId === animationId) {
        resetPreviousStyles();
        (_a = el.__done) == null ? void 0 : _a.call(el, evt.type === "animationcancel");
        delete el.__animId;
      }
      const elem = evt.target;
      toggleAnimEvents("remove", elem, eventCallback);
    }
  };
  toggleAnimEvents("add", el, eventCallback);
}
function beforeAnimStart(e, hook, animPhase, emit, configProp, getKeyframeName, getDuration, getDelay, getEase, getSpring3, propsConfig) {
  const state = getState(hook);
  const { waapi } = globalState;
  setAnimState(state, animPhase);
  $emit(emit, `before${capitalize(hook)}`, [e]);
  const el = e;
  if (!configProp.value) {
    return;
  }
  const delay = parseFloat(el.dataset.uitDelay || getDelay.value) || 0;
  const resetPreviousStyles = () => {
    if (el.__previousStyles) {
      Object.assign(el.style, el.__previousStyles);
      delete el.__previousStyles;
    }
  };
  resetPreviousStyles();
  const firstFrame = configProp.value.frame((from, _) => from, animPhase.value);
  const lastFrame = configProp.value.frame((_, to) => to, animPhase.value);
  if (!el.__previousStyles) {
    el.__previousStyles = {};
    for (const key in lastFrame) {
      el.__previousStyles[key] = el.style.getPropertyValue(key);
    }
  }
  setProperties(el, lastFrame);
  setProperties(el, firstFrame);
  if (!waapi) {
    setProperties(el, {
      "--uit-delay": `${delay}ms`
    });
    el.classList.add("ui-transition");
  }
  const createSpring = async () => {
    if (!configProp.value)
      return Promise.resolve({});
    const buildAnim = () => {
      if (typeof propsConfig === "object" && propsConfig.frame) {
        return __spreadProps(__spreadValues({}, propsConfig), {
          frame: propsConfig.frame.toString()
        });
      }
      return propsConfig;
    };
    return asyncWorker({
      type: "spring",
      data: {
        buildAnim: buildAnim(),
        keyframeName: getKeyframeName.value,
        waapi,
        animPhase: animPhase.value,
        config: getSpring3.value
      }
    });
  };
  if (waapi) {
    hasWaapi(createSpring, el.dataset.uitDuration || getDuration.value, el, el.dataset.uitEase || getEase.value, delay, resetPreviousStyles, lastFrame);
  } else {
    noWaapi(getKeyframeName.value, createSpring, el, resetPreviousStyles, el.dataset.uitEase || getEase.value);
  }
}
async function sleep(duration, callback) {
  await asyncWorker({
    type: "sleep",
    data: {
      duration
    }
  });
  if (typeof callback === "function") {
    return callback();
  } else
    return Promise.resolve();
}
function animStart(e, done, hook, emit, animPhase, configProp, getKeyframeName, getDuration) {
  const { keyframes, waapi } = globalState;
  const state = getState(hook);
  setAnimState(state, animPhase);
  $emit(emit, hook, [e]);
  if (!configProp.value) {
    return done();
  }
  const el = e;
  el.__done = (cancelled) => {
    done(cancelled);
    delete el.__done;
  };
  if (!waapi) {
    sleep().then(() => {
      const duration = () => {
        var _a, _b;
        if (el.dataset.uitDuration) {
          return parseFloat(el.dataset.uitDuration);
        }
        if (typeof getDuration.value === "string" && !!getDuration.value) {
          return getDuration.value;
        }
        if (/string|number/.test(typeof ((_a = configProp.value) == null ? void 0 : _a.duration))) {
          return parseFloat(`${(_b = configProp.value) == null ? void 0 : _b.duration}`) || 1;
        }
        return keyframes[getKeyframeName.value];
      };
      setProperties(el, {
        "--uit-anim-duration": `${duration()}ms`,
        "--uit-anim-name": getKeyframeName.value
      });
    });
  }
}
function animDone(e, hook, emit, animPhase, configProp, retainFinalStyle) {
  const state = getState(hook);
  setAnimState(state, animPhase);
  $emit(emit, `after${capitalize(hook)}`, [e]);
  resetEl(e);
  if (retainFinalStyle && configProp.value) {
    const el = e;
    const lastFrame = configProp.value.frame((_, to) => to, animPhase.value);
    setProperties(el, lastFrame);
  }
}
function animcancelled(el, hook, emit) {
  $emit(emit, `${hook}Cancelled`, [el]);
  resetEl(el);
}
const eventHooks = function(args) {
  const { configProp, getKeyframeName, animPhase, appear, emit, getDelay, getDuration, getEase, getSpring: getSpring3, propsConfig, fragment, retainFinalStyle } = args;
  const getHooks = (hook) => {
    if (hook === "appear" && !appear)
      return {};
    const capitalizeHook = capitalize(hook);
    return __spreadProps(__spreadValues({
      [`onBefore${capitalizeHook}`]: (el) => {
        beforeAnimStart(el, hook, animPhase, emit, configProp, getKeyframeName, getDuration, getDelay, getEase, getSpring3, propsConfig);
      },
      [`on${capitalizeHook}`]: (el, done) => {
        animStart(el, done, hook, emit, animPhase, configProp, getKeyframeName, getDuration);
      }
    }, fragment.value ? {} : {
      [`on${capitalizeHook}cancelled`]: (el) => {
        animcancelled(el, hook, emit);
      }
    }), {
      [`onAfter${capitalizeHook}`]: (el) => {
        animDone(el, hook, emit, animPhase, configProp, retainFinalStyle);
      }
    });
  };
  return __spreadValues(__spreadValues(__spreadValues({}, getHooks("appear")), getHooks("enter")), getHooks("leave"));
};
function extractDurationAndDelay(firstPriority, secondPriority, animPhase) {
  const getValue = (priority) => {
    if (typeof priority !== "undefined") {
      if (typeof priority === "number") {
        return `${priority}`;
      }
      if (typeof priority === "object") {
        const value = priority[animPhase];
        if (typeof value === "number") {
          return `${value}`;
        }
      }
    }
    return null;
  };
  const getFirstPriority = getValue(firstPriority);
  if (getFirstPriority) {
    return getFirstPriority;
  }
  const getSecondPriority = getValue(secondPriority);
  if (getSecondPriority) {
    return getSecondPriority;
  }
  return "";
}
function extractEase(propsEase, configEase, animPhase) {
  const getValue = (priority) => {
    if (typeof priority !== "undefined") {
      if (typeof priority === "string") {
        return `${priority}`;
      }
      if (typeof priority === "object") {
        const value = priority[animPhase];
        if (typeof value === "string") {
          return `${value}`;
        }
      }
    }
    return null;
  };
  const getFirstPriority = getValue(propsEase);
  if (getFirstPriority) {
    return getFirstPriority;
  }
  const getSecondPriority = getValue(configEase);
  if (getSecondPriority) {
    return getSecondPriority;
  }
  return "linear";
}
const springPreset = {
  default: {
    tension: 320,
    friction: 23,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 20
  },
  wobbly: {
    tension: 180,
    friction: 12,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 30
  },
  jello: {
    tension: 220,
    friction: 6,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 50
  },
  gentle: {
    tension: 120,
    friction: 14,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 20
  },
  stiff: {
    tension: 160,
    friction: 20,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    stopAttempt: 20
  },
  slow: {
    tension: 280,
    friction: 60,
    mass: 1,
    precision: 1e-3,
    velocity: 0,
    stopAttempt: 25
  }
};
function addSpring(name, config) {
  let extended = {};
  if (typeof config.extends === "string" && springPreset[config.extends]) {
    extended = springPreset[config.extends];
  }
  delete config.extends;
  springPreset[name] = __spreadValues(__spreadValues({}, extended), config);
}
function extractSpring(propsEase, configEase, animPhase) {
  const getValue = (priority) => {
    if (typeof priority !== "undefined") {
      if (typeof priority === "string") {
        return springPreset[priority.toLowerCase()] || null;
      }
      if (typeof priority === "object") {
        const value = priority[animPhase];
        if (value) {
          if (typeof value === "string") {
            return springPreset[value.toLowerCase()] || null;
          }
          if (typeof value === "object") {
            return value;
          }
        } else
          return priority;
      }
    }
    return null;
  };
  const getFirstPriority = getValue(propsEase);
  if (getFirstPriority) {
    return getFirstPriority;
  }
  const getSecondPriority = getValue(configEase);
  if (getSecondPriority) {
    return getSecondPriority;
  }
  return springPreset.default;
}
const _sfc_main = defineComponent({
  name: "UiTransition",
  props,
  setup(_props, { slots, emit }) {
    const animPhase = ref("enter");
    const props2 = computed(() => _props);
    const getConfig = computed(() => extractConfig(props2.value.config, animPhase.value));
    const getDuration = computed(() => extractDurationAndDelay(props2.value.duration, getConfig.value.duration, animPhase.value));
    const getDelay = computed(() => extractDurationAndDelay(props2.value.delay, getConfig.value.delay, animPhase.value));
    const getEase = computed(() => extractEase(props2.value.ease, getConfig.value.ease || "", animPhase.value));
    const getSpring3 = computed(() => extractSpring(props2.value.spring, getConfig.value.spring, animPhase.value));
    const getKeyframeName = computed(() => keyframeName(getConfig.value, getSpring3.value, animPhase.value));
    const fragment = computed(() => {
      return props2.value.group && !props2.value.tag;
    });
    onBeforeMount(beforeMount);
    return function() {
      const transitionElArgs = {
        slots,
        data: __spreadValues({
          type: "animation",
          css: props2.value.css,
          appear: props2.value.appear,
          mode: props2.value.group ? void 0 : props2.value.mode,
          tag: props2.value.group ? props2.value.tag : void 0,
          moveClass: props2.value.group ? props2.value.moveClass : void 0,
          enterFromClass: props2.value.enterFromClass,
          enterActiveClass: props2.value.enterActiveClass,
          enterToClass: props2.value.enterToClass,
          appearFromClass: props2.value.appearFromClass,
          appearActiveClass: props2.value.appearActiveClass,
          appearToClass: props2.value.appearToClass,
          leaveFromClass: props2.value.leaveFromClass,
          leaveActiveClass: props2.value.leaveActiveClass,
          leaveToClass: props2.value.leaveToClass
        }, eventHooks({
          animPhase,
          appear: props2.value.appear,
          configProp: getConfig,
          emit,
          getKeyframeName,
          getDuration,
          getDelay,
          getEase,
          getSpring: getSpring3,
          propsConfig: props2.value.config,
          fragment,
          retainFinalStyle: props2.value.retainFinalStyle
        }))
      };
      if (props2.value.group) {
        return TransitionGroup(transitionElArgs);
      }
      return Transition(transitionElArgs);
    };
  }
});
let installed = false;
function install(app, config = {}) {
  if (installed)
    return;
  let { componentName = options.componentName, globals } = config;
  if (typeof globals === "undefined") {
    globals = options.globals;
  }
  if (componentName) {
    options.componentName = componentName;
  }
  if (globals) {
    const globalValues = [];
    const validGlobals = ["sleep", "getSpring"];
    for (const item of globals) {
      if (typeof item === "string" && validGlobals.includes(item)) {
        globalValues.push({
          [item]: item
        });
      }
      if (typeof item === "object") {
        for (const key in item) {
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
      _sfc_main.props[key].default = config.props[key];
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
    const availableGlobals = {
      sleep,
      getSpring
    };
    const setGlobalValue = (obj) => {
      for (const [_key, _value] of Object.entries(obj)) {
        const key = `$${_value}`;
        const value = availableGlobals[_key];
        if (value) {
          app.provide(key, value);
          app.config.globalProperties[key] = value;
        }
      }
    };
    for (const value of options.globals) {
      setGlobalValue(value);
    }
  }
  const cName = options.componentName || "UiTransition";
  app.component(pascalCase(cName), _sfc_main);
  app.component(kebabCase(cName), _sfc_main);
  installed = true;
}
export { install as default };
