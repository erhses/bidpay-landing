export interface HeroOptions {
  /** Font family list for text drawn into the scene (the amount and the payment captions). */
  font?: string;
  /** Caption on the back of payment n. */
  label?: (n: number) => string;
  /** Image shown on the phone's screen. */
  screen?: string;
  /** What the scene shows in turn: [purchase amount, number of payments from 2 to 6]. */
  cycles?: Array<readonly [number, number]>;
}

export interface HeroApi {
  start(): void;
  stop(): void;
  /** Pointer position over the scene, each axis from -1 to 1. */
  point(x: number, y: number): void;
  /** Move on to the next amount. */
  next(): void;
  /** Draw one settled frame of cycle `index`, `at` seconds in. */
  pose(index: number, at: number): void;
  fit(): void;
  dispose(): void;
}

declare const BP: {
  hero(canvas: HTMLCanvasElement, options?: HeroOptions): HeroApi;
};

export default BP;
