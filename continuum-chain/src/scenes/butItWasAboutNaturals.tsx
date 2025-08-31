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
        tex={"\\text{But it was about naturals?}"}
        position={[0, -400]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 1)}
        tex={"|\\mathbb{Q}| = |\\mathbb{N}|"}
        position={[0, -200]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
    </>
  );

  videoRef().play();
  yield* slideTransition(Direction.Bottom, 1);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(3);
  yield* texts[1].opacity(1, 1);
  videoRef().pause();
  yield* waitFor(6);
  videoRef().seek(11.5);
  videoRef().play();
  yield* waitFor(2);
});
