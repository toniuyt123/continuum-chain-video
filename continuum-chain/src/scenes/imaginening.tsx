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
  const numberLineRef = createRef<NumberLine>();
  const width = 1000;

  view.add(
    <>
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{Finite difference}"]}
        position={[0, -450]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\emptyset", "\\subset \\{1,2,3,4\\}"]}
        position={[0, -300]}
        fill={"white"}
        fontSize={60}
        opacity={0}
      />

      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{No set here!}"]}
        position={[-200, -150]}
        fill={"lightseagreen"}
        fontSize={48}
        opacity={0}
      />
      <QuadBezier
        ref={makeRef(arrows, 0)}
        p0={texts[2].position()}
        p1={[-600, -100]}
        p2={[-540, -300]}
        stroke={"lightseagreen"}
        lineWidth={6}
        end={0}
        endArrow
        arrowSize={16}
        startOffset={170}
        endOffset={30}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{Infinite Difference}"]}
        position={[0, 0]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\dots \\subset S_1", "\\subset S_2 \\subset \\dots"]}
        position={[0, 150]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />

      <Latex
        ref={makeRef(texts, texts.length)}
        tex={[
          "\\dots \\subset S_1",
          "\\subset S_2 \\subset S_3 \\subset \\dots",
        ]}
        position={[0, -250]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />

      <NumberLine
        ref={numberLineRef}
        position={[0, 330]}
        points={[
          [-width / 2, 0],
          [width / 2, 0],
        ]}
        lineWidth={6}
        stroke={"white"}
        startArrow
        endArrow
        start={0.5}
        end={0.5}
        lineScale={600}
      />
      <Line
        ref={makeRef(arrows, 1)}
        stroke={"lightseagreen"}
        lineWidth={6}
        end={0}
        arrowSize={16}
      />
    </>
  );

  yield* slideTransition(Direction.Bottom, 2);
  yield* waitFor(2);
  yield* all(texts[0].opacity(1, 1), texts[1].opacity(1, 1));
  yield* waitFor(4);
  yield* texts[1].tex(
    ["\\emptyset", "\\subset \\{1,2,3\\}", "\\subset \\{1,2,3,4\\}"],
    1
  );
  yield* waitFor(7);
  yield* texts[1].tex(
    [
      "\\emptyset",
      "\\subset \\{1,2\\}",
      "\\subset \\{1,2,3\\}",
      "\\subset \\{1,2,3,4\\}",
    ],
    1
  );

  yield* waitFor(2);
  yield* texts[1].tex(
    [
      "\\emptyset",
      "\\subset \\{1\\}",
      "\\subset \\{1,2\\}",
      "\\subset \\{1,2,3\\}",
      "\\subset \\{1,2,3,4\\}",
    ],
    1
  );
  yield* waitFor(5);
  yield* all(arrows[0].end(1, 1, easeInOutCubic), texts[2].opacity(1, 1));

  yield* waitFor(4);
  yield* all(texts[4].opacity(1, 1), texts[3].opacity(1, 1));

  yield* texts[4].tex(
    texts[4]
      .tex()
      .slice(0, 1)
      .concat(["\\subset S_{\\frac{1}{2}}"])
      .concat(texts[4].tex().slice(1)),
    1
  );
  yield* texts[4].tex(
    texts[4]
      .tex()
      .slice(0, 1)
      .concat(["\\subset S_{\\frac{1}{4}}"])
      .concat(texts[4].tex().slice(1)),
    1
  );
  yield* texts[4].tex(
    texts[4]
      .tex()
      .slice(0, 1)
      .concat(["\\subset \\dots"])
      .concat(texts[4].tex().slice(1)),
    1
  );

  yield* waitFor(2);
  yield* all(
    numberLineRef().start(0, 1, easeInOutCubic),
    numberLineRef().end(1, 1, easeInOutCubic)
  );
  yield* all(
    numberLineRef().addNumber(-0.5, { tex: "r_1" }),
    numberLineRef().addNumber(0.5, { tex: "r_2" })
  );
  yield* numberLineRef().addNumber(0, { tex: "q" });
  yield* waitFor(1);

  arrows[1].points([
    numberLineRef()
      .numbers[0].children()[0]
      .position()
      .add(numberLineRef().position())
      .add(new Vector2(0, 50)),
    numberLineRef()
      .numbers[1].children()[0]
      .position()
      .add(numberLineRef().position())
      .add(new Vector2(0, 50)),
  ]);

  yield* all(
    numberLineRef().numbers[2].opacity(0, 1),
    arrows[1].end(1, 1, easeInOutCubic)
  );
  yield* waitFor(1);
  yield* numberLineRef().populateBetween(-0.5, 0.5, 7, 0.05, 0.2, 1);

  yield* waitFor(10);
});
