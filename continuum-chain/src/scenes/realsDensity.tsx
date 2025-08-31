import { Latex, Line, makeScene2D, QuadBezier, Rect } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  Logger,
  makeRef,
  slideTransition,
  useLogger,
  waitFor,
} from "@motion-canvas/core";
import { NumberLine } from "../components/NumberLine";
import { ListOfNumbers } from "../components/ListOfNumbers";
import { randomInt, screenToScene } from "../utils/utils";

export default makeScene2D(function* (view) {
  const headingRef = createRef<Latex>();
  const texts: Latex[] = [];

  const numberLineRef = createRef<NumberLine>();
  const width = 1500;
  const reals: ListOfNumbers[] = [];

  const len = 100;
  const realNum = ["0."].concat(
    Array.from({ length: len }, (_, i) => randomInt(0, 9).toString())
  );
  const realLabels: Latex[] = [];
  const realsRect = createRef<Rect>();
  const constructedRational = createRef<Rect>();
  view.add(
    <>
      <Latex
        ref={headingRef}
        tex={"\\text{Rationals in the Reals}"}
        position={[0, -450]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Rect layout position={[100, -200]} opacity={0} ref={constructedRational}>
        <Latex
          ref={makeRef(realLabels, 2)}
          tex={"r_2 = \\"}
          fill={"white"}
          opacity={0}
        />

        <ListOfNumbers
          ref={makeRef(reals, 2)}
          numbers={[
            ...realNum.slice(0, 70),
            "1",
            "5",
            ...Array.from({ length: len - 71 }, (_, i) => ""),
          ]}
          gap={0}
          initialRendered={71}
        />
      </Rect>
      <Rect
        layout
        ref={realsRect}
        direction={"column"}
        gap={50}
        alignItems={"center"}
        position={[900, -200]}
      >
        <Rect layout>
          <Latex
            ref={makeRef(realLabels, 0)}
            tex={"r_1 = \\"}
            fill={"white"}
            opacity={0}
          />
          <ListOfNumbers ref={makeRef(reals, 0)} numbers={realNum} gap={0} />
        </Rect>

        <Rect layout>
          <Latex
            ref={makeRef(realLabels, 1)}
            tex={"r_2 = \\"}
            fill={"white"}
            opacity={0}
          />

          <ListOfNumbers
            ref={makeRef(reals, 1)}
            numbers={[...realNum.slice(0, 70), "1", ...realNum.slice(71)]}
            gap={0}
          />
        </Rect>
      </Rect>
      <Rect
        layout
        direction={"column"}
        gap={50}
        alignItems={"center"}
        position={[-0, 150]}
      >
        <Latex
          ref={makeRef(texts, 0)}
          tex={"r_1 \\neq r_2"}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, 1)}
          tex={"\\text{There must be a difference in the digits.}"}
          fill={"white"}
          opacity={0}
        />

        <Latex
          ref={makeRef(texts, 2)}
          tex={
            "\\text{*Simplifying a bit because there are cases like } 0.999... = 1"
          }
          fill={"white"}
          opacity={0}
          fontSize={36}
        />
      </Rect>
      <NumberLine
        ref={numberLineRef}
        position={[0, 200]}
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
        centerOffset={-300}
        lineScale={600}
      />
    </>
  );

  yield* waitFor(2);
  yield* headingRef().opacity(1, 1);
  yield* waitFor(2);

  yield* all(
    reals[0].renderSome(len),
    reals[1].renderSome(len),
    realLabels[0].opacity(1, 1),
    realLabels[1].opacity(1, 1)
  );
  yield* waitFor(3.5);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(1.7);

  yield* texts[1].opacity(1, 1);
  yield* waitFor(1.5);
  yield* texts[2].opacity(1, 1);

  yield* waitFor(2);
  yield* realsRect().position.x(100, 2, easeInOutCubic);

  const arrow = createRef<QuadBezier>();
  view.add(
    <QuadBezier
      ref={arrow}
      p0={[400, 0]}
      p1={[600, 100]}
      p2={() => screenToScene(reals[1].latexNums[70].absolutePosition())}
      endOffset={25}
      stroke={"lightseagreen"}
      lineWidth={6}
      endArrow
      end={0}
    />
  );
  yield* all(
    arrow().end(1, 1.5, easeInOutCubic),
    reals[1].latexNums[70].fill("lightseagreen", 1.5),
    reals[0].latexNums[70].fill("lightseagreen", 1.5)
  );
  yield* waitFor(2);
  yield* all(
    ...reals[1].latexNums.slice(71).map((latex) => latex.opacity(0, 1)),
    ...reals[0].latexNums.slice(71).map((latex) => latex.opacity(0, 1))
  );

  yield* waitFor(2);
  yield* all(constructedRational().opacity(1, 1), realsRect().gap(150, 1));
  yield* waitFor(2);
  yield* reals[2].renderSome(1);

  yield* waitFor(4);
  yield* all(arrow().start(1, 1), ...texts.map((text) => text.opacity(0, 1)));

  view.add(
    <NumberLine
      ref={numberLineRef}
      position={[0, 200]}
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
  );
  yield* all(
    numberLineRef().start(0, 1, easeInOutCubic),
    numberLineRef().end(1, 1, easeInOutCubic)
  );
  yield* all(
    numberLineRef().addNumber(-0.5, { tex: "r_1" }),
    numberLineRef().addNumber(0.5, { tex: "r_2" })
  );
  for (let i = 1; i < 4; i++) {
    yield* numberLineRef().addNumber(
      0.25 * i - 0.5,
      { tex: `` },
      { stroke: "rgb(27,27,27)", lineWidth: 20 }
    );
  }
  yield* waitFor(6);
  yield* all(
    ...numberLineRef()
      .numbers.slice(2)
      .map((latex) => latex.opacity(0, 1))
  );
  yield* waitFor(4);
  yield* numberLineRef().addNumber(0, { tex: `q` });
  yield* waitFor(6.5);
  for (let i = 1; i < 7; i++) {
    yield* numberLineRef().lineScale(600 - i * 95, 0.7);
  }

  yield* waitFor(2);
});
