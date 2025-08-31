import { Latex, Line, makeScene2D } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  easeOutCubic,
  loop,
  makeRef,
  sequence,
  slideTransition,
  useLogger,
  useScene,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { ListOfNumbers } from "../components/ListOfNumbers";
import { arrApplyGradual, pulseNode, screenToScene } from "../utils/utils";

function* flashLine(line: Line) {
  yield* loop(6, (i) => {
    return i % 2 == 0
      ? line.stroke("red", 0.2)
      : line.stroke("lightseagreen", 0.2);
  });
}

export default makeScene2D(function* (view) {
  const listOfNums1 = createRef<ListOfNumbers>();
  const listOfNums2 = createRef<ListOfNumbers>();
  const formula = createRef<Latex>();
  const formula2 = createRef<Latex>();
  const formula3 = createRef<Latex>();

  view.add(
    <>
      <ListOfNumbers
        position={[880, 0]}
        ref={listOfNums1}
        numbers={Array.from({ length: 30 }, (_, i) => i)}
      />
      <ListOfNumbers
        position={[880, 0]}
        ref={listOfNums2}
        numbers={Array.from({ length: 30 }, (_, i) => i)}
      />
      <Latex
        ref={formula}
        fill="white"
        opacity={0}
        tex={"{{n}} {{=}} -{{n}}"}
        position={[0, -400]}
        fontSize={64}
      />
      <Latex
        ref={formula2}
        fill={"white"}
        opacity={0}
        tex={
          "\\text{Denoted by |.| as in  } |\\mathbb{N}| = |\\mathbb{N} - \\{0\\}|"
        }
        position={[0, -300]}
        fontSize={54}
      />
      <Latex
        ref={formula3}
        fill={"white"}
        opacity={0}
        tex={["\\infty", "\\pm", "1", "= \\infty"]}
        position={[0, 300]}
        fontSize={54}
      />
    </>
  );

  yield* waitFor(4);
  yield* all(listOfNums1().renderSome(30), listOfNums2().renderSome(30));
  yield* waitFor(1);
  yield* all(
    listOfNums1().position.y(listOfNums1().position.y() - 100, 1),
    listOfNums2().position.y(listOfNums2().position.y() + 100, 1)
  );

  //   yield* listOfNums2().applyAnimated((latex) => {
  //     return latex.tex(["-", latex.tex()[0]], 1);
  //   }, 1);

  const logger = useLogger();
  const arrows: Line[] = [];
  for (let i = 0; i < listOfNums1().latexNums.length; i++) {
    view.add(
      <Line
        ref={makeRef(arrows, i)}
        points={[
          screenToScene(listOfNums1().latexNums[i].absolutePosition()),
          screenToScene(listOfNums2().latexNums[i].absolutePosition()),
        ]}
        stroke={"lightseagreen"}
        lineWidth={4}
        arrowSize={16}
        endArrow
        startOffset={25}
        endOffset={25}
        end={0}
      />
    );
  }

  yield* all(...arrows.map((line) => line.end(1, 1.5, easeInOutCubic)));

  yield* waitFor(2.5);

  yield* all(
    arrApplyGradual(listOfNums2().latexNums, (latex) =>
      latex.tex(["-", latex.tex()[0]], 1)
    )
  );

  yield* waitFor(2);
  yield* formula().opacity(1, 1);
  yield* waitFor(4);

  yield* all(
    arrApplyGradual(listOfNums2().latexNums, (latex) =>
      latex.tex([latex.tex()[1]], 1)
    )
  );
  yield* waitFor(2);

  yield* listOfNums2().latexNums[0].opacity(0, 1);
  yield* waitFor(2);
  yield* flashLine(arrows[0]);

  yield* waitFor(5);

  yield* arrows[0].points(
    [
      screenToScene(listOfNums1().latexNums[0].absolutePosition()),
      () => screenToScene(listOfNums2().latexNums[1].absolutePosition()),
    ],
    1.5,
    easeInOutCubic
  );

  yield* waitFor(4);

  yield* all(
    arrows[0].lineWidth(8, 0.7, easeOutCubic),
    arrows[0].position(arrows[0].position().add(new Vector2(0, -10)), 0.7),
    arrows[1].lineWidth(8, 0.7, easeOutCubic),
    arrows[1].position(arrows[0].position().add(new Vector2(0, -10)), 0.7)
  );
  yield* waitFor(1);
  yield* all(
    arrows[0].lineWidth(4, 0.7, easeOutCubic),
    arrows[0].position(arrows[0].position().add(new Vector2(0, 10)), 0.7),
    arrows[1].lineWidth(4, 0.7, easeOutCubic),
    arrows[1].position(arrows[0].position().add(new Vector2(0, 10)), 0.7)
  );

  yield* waitFor(5);

  yield* arrows[1].points(
    [
      screenToScene(listOfNums1().latexNums[1].absolutePosition()),
      () => screenToScene(listOfNums2().latexNums[2].absolutePosition()),
    ],
    1.5,
    easeInOutCubic
  );

  yield* waitFor(3);

  yield* arrApplyGradual(
    arrows.slice(2, arrows.length - 1),
    (line, i) =>
      line.points(
        [
          screenToScene(listOfNums1().latexNums[i + 2].absolutePosition()),
          () =>
            screenToScene(listOfNums2().latexNums[i + 3].absolutePosition()),
        ],
        1.5,
        easeInOutCubic
      ),
    0.5
  );

  yield* formula().tex("{{n}} {{=}} {{n}} + 1", 1);

  yield* listOfNums2().position.x(listOfNums2().position.x() - 115, 1);

  yield* waitFor(5);
  yield* formula2().opacity(1, 1);
  yield* waitFor(14);
  yield* formula3().opacity(1, 1);

  yield* waitFor(10);

  yield* all(
    ...listOfNums2()
      .latexNums.slice(0, 7)
      .map((latex) => latex.opacity(0, 1))
  );
  yield* waitFor(4);
  yield* all(
    formula().tex("{{n}} {{=}} {{n}} + m, \\text{ here } m = 7", 1),
    formula3().tex(["\\infty", "\\pm", "{m}", "= \\infty"], 1),
    ...arrows.map((arrow, i) =>
      arrow.points(
        [
          screenToScene(listOfNums1().latexNums[i].absolutePosition()),
          () =>
            screenToScene(
              listOfNums2().latexNums[
                Math.min(i + 7, listOfNums2().latexNums.length - 1)
              ].absolutePosition()
            ),
        ],
        2
      )
    )
  );

  yield* waitFor(5);
  yield* formula3().tex(["\\infty", "-", "\\infty", "= \\infty", "?"], 1);
  yield* waitFor(3);

  yield* all(
    ...listOfNums2().latexNums.map((latex) => latex.opacity(1, 1)),

    listOfNums2().position.x(listOfNums2().position.x() + 115, 1)
  );
  yield* all(
    ...arrows.map((arrow, i) =>
      arrow.points(
        [
          screenToScene(listOfNums1().latexNums[i].absolutePosition()),
          () => screenToScene(listOfNums2().latexNums[i].absolutePosition()),
        ],
        2
      )
    )
  );

  yield* all(
    ...listOfNums2().latexNums.map((latex, i) => {
      return i % 2 == 1 ? latex.margin([40, 0, 0, 0], 1) : null;
    })
  );

  yield* all(
    ...listOfNums2().latexNums.map((latex, i) => {
      return i % 2 == 1 ? latex.opacity(0, 1) : null;
    })
  );

  yield* waitFor(10);

  yield* all(
    formula().tex("{{n}} {{=}} 2{{n}}", 2),
    ...arrows.map((arrow, i) =>
      arrow.points(
        [
          screenToScene(listOfNums1().latexNums[i].absolutePosition()),
          () =>
            screenToScene(
              listOfNums2().latexNums[
                Math.min(2 * i, listOfNums2().latexNums.length - 1)
              ].absolutePosition()
            ),
        ],
        2
      )
    )
  );

  yield* waitFor(5);
});
