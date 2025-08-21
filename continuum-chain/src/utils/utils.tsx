import { all, delay, easeOutQuint, ThreadGenerator } from "@motion-canvas/core";

export function* arrApplyGradual<T>(
  arr: T[],
  f: (item: T, index?: number) => ThreadGenerator | Callback,
  delayMultiplier: number = 1
) {
  yield* all(
    ...arr.map((item, i) =>
      delay(easeOutQuint(i / (arr.length - 1)) * delayMultiplier, f(item, i))
    )
  );
}
