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
  const arrows: Line[] = [];

  const numberLineRef = createRef<NumberLine>();
  const width = 1500;

  view.add(
    <>
      <Latex
        ref={headingRef}
        tex={"\\text{Constructing the chain}"}
        position={[0, -450]}
        fill={"white"}
        fontSize={64}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 0)}
        tex={"{{\\text{continuum}}} = |\\mathbb{R}|"}
        fill={"white"}
        fontSize={64}
        opacity={0}
        position={[0, -300]}
      />
      <Rect
        layout
        direction={"column"}
        position={[0, 220]}
        gap={50}
        alignItems={"center"}
      >
        <Rect layout gap={50} alignItems={"center"}>
          <Latex ref={makeRef(texts, 1)} tex={"r"} fill={"white"} opacity={0} />
          <Line
            ref={makeRef(arrows, 0)}
            stroke={"white"}
            endArrow
            points={[
              [0, 0],
              [150, 0],
            ]}
            arrowSize={16}
            lineWidth={6}
            end={0}
          />
          <Latex
            ref={makeRef(texts, 2)}
            tex={
              "{{\\{}}\\text{All rationals } {{q}} \\text{ such that }{{q < r}} {{\\} }}"
            }
            fill={"white"}
            opacity={0}
          />
        </Rect>
        <Latex
          ref={makeRef(texts, 3)}
          tex={"{{r_1 <}} {{}} {{r_2}}"}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, 4)}
          tex={
            "\\text{Because } q_1 \\text{ would be in the second set but not the first}"
          }
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, 5)}
          tex={"{{\\{q \\ | \\ q <}} {{2}}{{\\} }}"}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, 6)}
          tex={
            "\\text{Continuum/uncountably many subsets of rationals which expand each other}"
          }
          fill={"white"}
          fontSize={36}
          opacity={0}
        />
      </Rect>
      <NumberLine
        ref={numberLineRef}
        position={[0, -100]}
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
        centerOffset={0}
        lineScale={600}
      />
      <Line
        ref={makeRef(arrows, 1)}
        points={[
          [300, -100],
          [-width / 2, -100],
        ]}
        stroke={"lightseagreen"}
        lineWidth={8}
        endArrow
        end={0}
      />
    </>
  );

  yield* headingRef().opacity(1, 1);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(4);

  yield* all(numberLineRef().start(0, 1), numberLineRef().end(1, 1));
  yield* waitFor(5);
  yield* all(
    numberLineRef().addNumber(-0.5, { tex: "r_1" }),
    numberLineRef().addNumber(0.5, { tex: "r_2" })
  );
  yield* waitFor(1);
  yield* numberLineRef().addNumber(0, { tex: "q_1" });

  yield* waitFor(3);
  yield* texts[1].opacity(1, 1);
  yield* arrows[0].end(1, 1, easeInOutCubic);
  yield* texts[2].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[2].tex("{{\\{}}{{q}} \\ | \\ {{q < r}} {{\\} }}", 2);
  yield* waitFor(3);
  yield* texts[2].tex(
    "{{\\{}}{{q}} \\ | \\ {{q < r}} {{\\} }} \\ \\ \\text{       *Dedekind cut}",
    2
  );

  yield* waitFor(2);
  yield* texts[3].opacity(1, 1);
  yield* texts[3].tex("{{r_1 <}} {{q_1 <}} {{r_2}}", 1);
  yield* texts[3].tex(
    "{{r_1 <}} {{q_1 <}} {{r_2}} \\implies \\{q \\ |\\  q < r_1\\} \\neq \\{q \\ |\\  q < r_2\\}",
    2
  );
  yield* waitFor(2);
  yield* texts[4].opacity(1, 1);

  yield* waitFor(8.5);
  yield* all(
    texts[5].opacity(1, 1),
    (numberLineRef().numbers[1].children()[0] as Latex).tex("2", 1),
    arrows[1].end(1, 1, easeInOutCubic)
  );
  yield* waitFor(2);
  yield* all(
    texts[5].tex(
      "{{\\{q \\ | \\ q <}} {{1}}{{\\} }} {{\\subset}} {{\\{q \\ | \\ q <}} {{2}}{{\\} }}",
      2
    ),
    (numberLineRef().numbers[0].children()[0] as Latex).tex("1", 1),
    arrows[1].start(0.57, 1, easeInOutCubic)
  );

  yield* waitFor(1);
  yield* all(
    (numberLineRef().numbers[1].children()[0] as Latex).tex("r_2", 1),
    texts[5].tex(
      "{{\\{q \\ | \\ q <}} {{1}}{{\\} }} {{\\subset}} {{\\{q \\ | \\ q <}} {{r_2}}{{\\} }}",
      1
    )
  );
  yield* all(
    (numberLineRef().numbers[0].children()[0] as Latex).tex("r_1", 1),
    texts[5].tex(
      "{{\\{q \\ | \\ q <}} {{r_1}}{{\\} }} {{\\subset}} {{\\{q \\ | \\ q <}} {{r_2}}{{\\} }}",
      1
    )
  );
  yield* waitFor(6);
  yield* texts[6].opacity(1, 1);

  yield* waitFor(10);
});
