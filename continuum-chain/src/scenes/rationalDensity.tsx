import { Latex, Line, makeScene2D, QuadBezier, Rect } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  makeRef,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";
import { NumberLine } from "../components/NumberLine";

export default makeScene2D(function* (view) {
  const headingRef = createRef<Latex>();
  const texts: Latex[] = [];

  const numberLineRef = createRef<NumberLine>();
  const width = 1500;

  view.add(
    <>
      <Latex
        ref={headingRef}
        tex={"\\text{Rational Density}"}
        position={[0, -450]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Rect
        layout
        direction={"column"}
        gap={50}
        alignItems={"center"}
        position={[0, -200]}
      >
        <Latex
          ref={makeRef(texts, 0)}
          tex={
            "{{\\text{Between any two \\textbf{different}}}} \\text{ rational } {{\\text{numbers, there exists another rational number.}}}"
          }
          fill={"white"}
          fontSize={36}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, 1)}
          tex={"{{q_1}} < {{q_2}}"}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, 2)}
          tex={
            "{{\\text{A number between }}} q_1 {{\\text{ and }}} q_2 {{\\text{ is }}} {{\\frac{q_1+q_2}{2}}}."
          }
          fill={"white"}
          opacity={0}
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

  yield* headingRef().opacity(1, 1);
  yield* waitFor(2);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(0.7);
  yield* texts[1].opacity(1, 1);
  yield* waitFor(0.5);

  yield* texts[1].tex("{{q_1}} < {{q_3}} < {{q_2}}", 1);

  yield* all(
    numberLineRef().start(0, 1, easeInOutCubic),
    numberLineRef().end(1, 1, easeInOutCubic)
  );

  yield* numberLineRef().addNumber(0);
  yield* numberLineRef().addNumber(1);
  yield* waitFor(0.6);
  yield* numberLineRef().addFraction(1, 2);
  yield* waitFor(2);
  yield* numberLineRef().addFraction(1, 4);
  yield* waitFor(2);
  yield* numberLineRef().lineScale(750, 2);
  yield* numberLineRef().addFraction(3, 8);
  yield* waitFor(2.5);
  yield* texts[2].opacity(1, 1);

  //   yield* all(numberLineRef().populateBetween(1 / 4, 3 / 8));
  //   yield* numberLineRef().centerOffset(100, 1);
  //   yield* numberLineRef().lineScale(200, 1);

  yield* waitFor(4.5);
  yield* numberLineRef().populateBetween(1 / 4, 3 / 8);
  yield* all(
    numberLineRef().lineScale(2000, 3),
    numberLineRef().centerOffset(-700, 3)
  );
  yield* all(
    numberLineRef().addNumber(0.29, {
      tex: "q_1 \\ \\",
      fontSize: 36,
    }),
    numberLineRef().addNumber(0.3, { tex: "\\ \\ q_2", fontSize: 36 })
  );
  yield* waitFor(2);

  const arrow = createRef<QuadBezier>();
  view.add(
    <>
      <QuadBezier
        ref={arrow}
        stroke={"lightseagreen"}
        lineWidth={8}
        endArrow
        p0={[100, 400]}
        p1={[-200, 400]}
        p2={[-110, 200]}
        end={0}
      />
      <Latex
        ref={makeRef(texts, 3)}
        tex={"\\frac{q_1+q_2}{2}"}
        position={[200, 400]}
        fill={"lightseagreen"}
        fontSize={36}
        opacity={0}
      />
    </>
  );

  yield* all(arrow().end(1, 1, easeInOutCubic), texts[3].opacity(1, 1));

  yield* waitFor(6);
  yield* texts[0].tex(
    "{{\\text{Between any two \\textbf{different}}}} \\text{\\textbf{ REAL }} {{\\text{numbers, there exists another rational number.}}}",
    1
  );
  yield* waitFor(3);
  yield* texts[1].tex("{{r_1}} < {{q_3}} < {{r_2}}", 1);
  yield* waitFor(2);
  yield* texts[2].tex(
    "\\frac{r_1 + r_2}{2} \\text{ is not always a rational now!} ",
    2
  );

  yield* waitFor(4);
});
