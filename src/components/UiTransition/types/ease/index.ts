export type Eases =
  | "bounce"
  | "bounce.in"
  | "bounce.inOut"
  | "back"
  | "back.in"
  | "back.inOut"
  | "elastic"
  | "elastic.in"
  | "elastice.inOut"
  | "cubic"
  | "cubic.in"
  | "cubic.inOut"
  | "sine"
  | "sine.in"
  | "sine.inOut"
  | "quad"
  | "quad.in"
  | "quad.inOut";

export type EaseConfig = Eases | ((x: number) => number);
