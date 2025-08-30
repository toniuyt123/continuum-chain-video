import { Grid, Latex, Line, makeScene2D, Video } from "@motion-canvas/2d";
import {
  all,
  createRef,
  makeRef,
  sequence,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import video from "../../../3d-stuff/video_output/sheep_story.mp4";

export default makeScene2D(function* (view) {
  const videoRef = createRef<Video>();
  view.add(<Video src={video} ref={videoRef} />);

  const lines: Line[] = [];
  const startPosition = new Vector2(-270, -430);
  const mirroredStart = new Vector2(-startPosition.x + 50, startPosition.y);
  const offset = new Vector2(-25, 225);
  const mirrorOffset = new Vector2(-offset.x, offset.y);

  for (let i = 0; i < 4; i++) {
    view.add(
      <Line
        ref={makeRef(lines, i)}
        stroke={"lightseagreen"}
        lineWidth={8}
        endArrow
        end={0}
        points={[
          startPosition.add(offset.scale(i)),
          mirroredStart.add(mirrorOffset.scale(i)),
        ]}
      />
    );
  }

  videoRef().play();
  yield* waitFor(8);
  yield* sequence(0.7, ...lines.map((line) => line.end(1, 1)));
  yield* waitFor(4.5);
  yield* lines[lines.length - 1].opacity(0, 1);

  yield* waitFor(6);
  yield* all(...lines.map((line) => line.opacity(0, 1)));

  const exclamation = createRef<Latex>();
  view.add(
    <Latex
      ref={exclamation}
      tex="!"
      fill={"white"}
      fontSize={80}
      position={[50, -150]}
      opacity={0}
    />
  );
  yield* waitFor(2);
  yield* exclamation().opacity(1, 1);
  yield* waitFor(0.5);
});
