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
        tex={["\\{2,4,6,\\dots\\}"]}
        position={[0, -0]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />

      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{Add every second odd}"]}
        position={[0, -100]}
        fill={"white"}
        fontSize={48}
        opacity={0}
      />

      <Latex
        ref={makeRef(texts, texts.length)}
        tex={[
          "\\text{Still infinite difference because we have hald the odds left}",
        ]}
        position={[0, 200]}
        fill={"lightseagreen"}
        fontSize={48}
        opacity={0}
      />
      <QuadBezier
        ref={makeRef(arrows, 0)}
        p0={texts[2].position()}
        p1={[-200, 100]}
        p2={[-150, 0]}
        stroke={"lightseagreen"}
        lineWidth={6}
        end={0}
        endArrow
        arrowSize={16}
        startOffset={15}
        endOffset={30}
      />
      <QuadBezier
        ref={makeRef(arrows, 1)}
        p0={texts[2].position()}
        p1={[400, 100]}
        p2={[500, 0]}
        stroke={"lightseagreen"}
        lineWidth={6}
        end={0}
        endArrow
        arrowSize={16}
        startOffset={25}
        endOffset={30}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{This is still countable}"]}
        position={[0, 300]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
    </>
  );

  yield* slideTransition(Direction.Bottom, 2);
  yield* waitFor(1);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(0.4);
  yield* texts[0].tex(texts[0].tex().concat(["\\subset \\mathbb{N}"]), 1);
  yield* waitFor(8);
  yield* all(
    texts[1].opacity(1, 2),
    texts[0].tex(
      [
        "\\{2,4,6,\\dots\\}",
        "\\subset \\{1,2,4,5,6,8\\dots\\}",
        "\\subset \\mathbb{N}",
      ],
      2
    )
  );
  yield* waitFor(3);

  yield* all(
    ...arrows.map((arrow) => arrow.end(1, 1, easeInOutCubic)),
    texts[2].opacity(1, 1)
  );
  yield* waitFor(1.5);
  yield* all(
    ...arrows.map((arrow) => arrow.end(0, 1, easeInOutCubic)),
    texts[0].tex(
      [
        "\\{2,4,6,\\dots\\}",
        "\\subset \\{1,2,4,6,8\\dots\\}",
        "\\subset \\{1,2,4,5,6,8\\dots\\}",
        "\\subset \\mathbb{N}",
      ],
      1
    ),
    texts[0].scale(0.7, 1)
  );
  yield* all(
    texts[0].tex(
      [
        "\\{2,4,6,\\dots\\}",
        "\\subset \\dots",
        "\\subset \\{1,2,4,6,8\\dots\\}",
        "\\subset \\{1,2,4,5,6,8\\dots\\}",
        "\\subset \\mathbb{N}",
      ],
      1
    )
  );
  yield* waitFor(6);
  yield* texts[3].opacity(1, 1);

  yield* waitFor(6);
});
