import { Grid, Latex, Line, makeScene2D, Video } from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  makeRef,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import video from "../../../3d-stuff/video_output/confusedSHepherd.mp4";

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];

  view.add(
    <>
      <Latex
        ref={makeRef(texts, 0)}
        tex={"\\text{Some stuff from pesho?}"}
        position={[0, -400]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
    </>
  );

  yield* slideTransition(Direction.Left, 1);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(28);
});
