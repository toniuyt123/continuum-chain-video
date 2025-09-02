import {
  Grid,
  Latex,
  Line,
  makeScene2D,
  QuadBezier,
  Video,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  makeRef,
  sequence,
  slideTransition,
  useLogger,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import video from "../../../3d-stuff/video_output/confusedSHepherd.mp4";
import { NumberLine } from "../components/NumberLine";

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];
  const arrows: Line[] = [];

  view.add(
    <>
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={[
          "\\mathbb{N} = \\{",
          "0,",
          "1,",
          "2,",
          "3,",
          "4,5,6,7,8,9,\\dots\\}",
        ]}
        position={[0, -300]}
        fill={"white"}
        fontSize={64}
      />

      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\emptyset"]}
        position={[0, 0]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{Uncountably many ways to continue!}"]}
        position={[0, 200]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
    </>
  );

  yield* slideTransition(Direction.Bottom, 2);
  yield* waitFor(1);
  yield* texts[1].opacity(1, 1);
  yield* all(
    texts[1].tex(texts[1].tex().concat(["\\subset \\{0\\}"]), 1),
    texts[0].tex(texts[0].tex().slice(0, 1).concat(texts[0].tex().slice(2)), 1)
  );
  yield* all(
    texts[1].tex(texts[1].tex().concat(["\\subset \\{0,1\\}"]), 1),
    texts[0].tex(texts[0].tex().slice(0, 1).concat(texts[0].tex().slice(2)), 1)
  );

  yield* all(
    texts[1].tex(texts[1].tex().concat(["\\subset \\{0,1,2\\}"]), 1),
    texts[0].tex(texts[0].tex().slice(0, 1).concat(texts[0].tex().slice(2)), 1)
  );
  yield* all(
    texts[1].tex(texts[1].tex().concat(["\\subset ..."]), 1),
    texts[0].tex(texts[0].tex().slice(0, 1).concat(texts[0].tex().slice(2)), 1)
  );

  yield* texts[2].opacity(1, 1);

  yield* waitFor(5);
});
