import { Node } from "@motion-canvas/2d";
import {
  all,
  delay,
  easeInBack,
  easeOutBack,
  easeOutQuint,
  ThreadGenerator,
} from "@motion-canvas/core";

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

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function* squishTransform(
  node: Node,
  transformFn: (node: Node) => void
) {
  yield* node.scale(0, 0.4, easeInBack);
  transformFn(node);
  yield* node.scale(1, 0.4, easeOutBack);
}

export function* squishTransformAll(
  nodes: Node[],
  transformFn: (node: Node, i: number) => void
) {
  yield* all(
    ...nodes.map((node, i) => squishTransform(node, (n) => transformFn(n, i)))
  );
}
