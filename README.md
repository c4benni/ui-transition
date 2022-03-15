<div align="center">
  
# UiTransition
  
#### *Create dynamic CSS spring animations*
  
</div>

## Intro

UiTransition is a Vue JS **_component_** that tries to provide an easy way to use **_spring animations_** for enter and leave states of DOM nodes. Although there is an API available to get an array of spring values, _this package was created to be used as a component, not a fully fledged animation library._

<hr/>

## Quick peek

_config can be customized to your taste_

```vue
// basic
<UiTransition config="slideX">
    <div v-if="show" />
</UiTransition>

// with arguments
<UiTransition config="slideX(0, 100)">
    <div v-if="show" />
</UiTransition>

// different entrance and exit animations
<UiTransition
  :config="{
    enter: 'slideX',
    leave: 'fade(0, 0.75)',
  }"
>
    <div v-if="show" />
</UiTransition>
```

## Get started

```bash
$ npm i ui-transition
```

```ts
// import App, and createApp

import UiTransition from "ui-transition";

const app = createApp(App);

// basic
app.use(UiTransition);

// with your configurations
app.use(UiTransition, {
  // set default values,
  // build animations,
  // set spring presets,
  // or leave it blank...
  // spring presets, and animations
  // can be created on the fly.
});
```

## The why...

I'm a big fan of smooth transitioning with a natural feel for DOM nodes. This library was created to simplify that process of using a spring animation that will run at ~60FPS. **_Even on low power mode._**
<br>
To be honest, [`raf`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) won't achive that kind of performance, even when animating composite properties (transform, opacity). If you need to make a bulky request, be ready for some janky animations.
<br>
This is where `<UiTransition />` comes in 👨‍🏫. `<UiTransition />` uses the [`WAAPI`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) if it is available, and falls back to using `CSS Keyframes`. Keyframes uses [off main thread animation](https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_JavaScript_animation_performance#off_main_thread_animation) so you can be sure to do CPU draining tasks with your DOM node on the main thread, without having it interupted with calculations on every frame to create _spring animations_, ensuring a butter smooth animation with a natural feel.

## Props

### `config`

This is where all the magic happens. A dynamic prop that accepts different types. If `false` is passed here, no animation will be used.

##### `propType`

`string | boolean | BuildAnim`

<details>
<summary>
  <strong>
    <code>types</code>
  </strong>
</summary>

<div>

Custom types assosiated with the `config` prop. The `BuildAnim` type above is explained below.

```ts
// This is the BuildAnim type
interface BuildAnim extends Anim {
  enter?: Anim;
  leave?: Anim;
}

interface Anim {
  frame: Frame;
  extends?: string;
  duration?: DurationAndDelay;
  delay?: DurationAndDelay;
  ease?: Ease;
  spring?: Spring;
}

type Frame = (step: Step, phase: AnimPhase) => DynamicObject<string | number>;

type Step = (
  from: number | number[],
  to: number | number[]
) => number | number[];

type AnimPhase = "enter" | "leave";

interface DynamicObject<T> {
  [key: string]: T;
}

type DurationAndDelay = number | AnimPhaseObject<number> | undefined;

type AnimPhaseObject<T> = {
  [key in AnimPhase]?: T;
};

type Ease = string | AnimPhaseObject<string>;

type Spring = string | AnimPhaseObject<SpringRoot>;

type SpringRoot = string | SpringObject;

type SpringObject = {
  tension?: number;
  friction?: number;
  mass?: number;
  precision?: number;
  velocity?: number;
  stopAttempt?: number;
};
```

</div>
</details>

##### `default`

`'fade'`

<!-- TODO: spring -->

### `delay`

Set animation delay.

##### `propType`

`number` | `{enter?: number; leave?: number}`

### `duration`

Control how long your spring animations should last!

> Leave `undefined` for the default spring feel

##### `propType`

`number` | `{enter?: number; leave?: number}`

### `ease`

Control the easing curve of your spring animation! Use css easings like `ease-out`, or a cubic bezier function to add more dynamics to your animations!

> Use `'linear'` for the default spring feel

##### `propType`

`string` | `{enter?: string; leave?: string}`

##### `default`

`'linear'`

### `group`

Used to set the underlying component to `<TransitionGroup />` rather than default `<Transition />`

> Read more about Vue's `<TransitionGroup />` [here](https://vuejs.org/api/built-in-components.html#transitiongroup)

##### `propType`

`boolean`

### `retainFinalStyle`

Useful when you need an element to stay in its final animation position. Default behavior is to remove all animation styles applied.

##### `propType`

`boolean`
