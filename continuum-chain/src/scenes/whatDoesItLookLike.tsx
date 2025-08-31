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
        tex={"\\text{What does it look like?}"}
        position={[0, -400]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 1)}
        tex={["\\emptyset"]}
        position={[0, -200]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 2)}
        tex={["\\text{The chain itself is dense}"]}
        position={[0, 0]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 3)}
        tex={[
          "\\dots \\subset S_1",
          "\\subset S_2 \\subset S_3 \\subset \\dots",
        ]}
        position={[0, 150]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
    </>
  );

  yield* slideTransition(Direction.Bottom, 1);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[1].opacity(1, 1);
  yield* texts[1].tex(texts[1].tex().concat(" \\subset \\{1\\}"), 1);
  yield* texts[1].tex(texts[1].tex().concat(" \\subset \\{1,2\\}"), 1);
  yield* texts[1].tex(texts[1].tex().concat(" \\subset \\{1,2,10\\}"), 1);
  yield* texts[1].tex(texts[1].tex().concat(" \\subset \\ ??"), 1);
  yield* waitFor(4);
  yield* texts[2].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[3].opacity(1, 1);
  yield* waitFor(4);
  yield* texts[3].tex(["\\emptyset \\subset"].concat(texts[3].tex()), 1);
  yield* texts[3].tex(texts[3].tex().concat(["\\subset \\mathbb{N}"]), 1);
  yield* waitFor(4);
  yield* texts[3].tex(
    texts[3]
      .tex()
      .slice(0, 2)
      .concat(["\\subset S_{\\frac{1}{2}}"])
      .concat(texts[3].tex().slice(2)),
    1
  );
  yield* texts[3].tex(
    texts[3]
      .tex()
      .slice(0, 2)
      .concat(["\\subset S_{\\frac{1}{4}}"])
      .concat(texts[3].tex().slice(2)),
    1
  );
  yield* texts[3].tex(
    texts[3]
      .tex()
      .slice(0, 3)
      .concat(["\\subset \\dots"])
      .concat(texts[3].tex().slice(3)),
    1
  );
  yield* waitFor(5);
});
