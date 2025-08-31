import { makeScene2D, Rect } from '@motion-canvas/2d';
import {
  createRef,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // simple test object
  const box = createRef<Rect>();
  view.add(<Rect ref={box} width={200} height={200} fill="red" />);

  // animate it
  yield* box().rotation(360, 2);
});