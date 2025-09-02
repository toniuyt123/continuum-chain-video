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
  const videoRef = createRef<Video>();
  const texts: Latex[] = [];

  view.add(
    <>
      <Video src={video} ref={videoRef} />
      <Latex
        ref={makeRef(texts, 0)}
        tex={"\\text{Im lost...}"}
        position={[-400, -300]}
        fill={"white"}
        fontSize={60}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 1)}
        tex={"\\text{To infinity and beyond!}"}
        position={[0, -150]}
        fill={"white"}
        fontSize={60}
        opacity={0}
      />
    </>
  );

  yield;
  videoRef().play();
  yield* slideTransition(Direction.Bottom, 1);
  yield* waitFor(2);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(7);
  yield* texts[1].opacity(1, 0.5);
  yield* waitFor(1.5);
});
