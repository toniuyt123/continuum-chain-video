import { Node } from "@motion-canvas/2d";
import {
  all,
  delay,
  easeInBack,
  easeInOutCubic,
  easeOutBack,
  easeOutQuint,
  ThreadGenerator,
  waitFor,
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

export function* pulseNode(
  node: Node,
  scale: number = 1.2,
  growTime: number = 0.5,
  duration: number = 0.5
) {
  yield* node.scale(scale, growTime, easeInOutCubic);
  yield* waitFor(duration);
  yield* node.scale(1, growTime, easeInOutCubic);
}
