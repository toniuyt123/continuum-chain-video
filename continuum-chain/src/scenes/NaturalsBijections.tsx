import { Latex, Line, makeScene2D } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
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
import { arrApplyGradual } from "../utils/utils";

function screenToScene(screenCoords: Vector2): Vector2 {
  const viewSize = useScene().getSize();
  return new Vector2(
    screenCoords.x - viewSize.x / 2,
    screenCoords.y - viewSize.y / 2
  );
}

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

  view.add(
    <>
      <ListOfNumbers
        position={[600, 0]}
        ref={listOfNums1}
        numbers={Array.from({ length: 30 }, (_, i) => i)}
      />
      <ListOfNumbers
        position={[600, 0]}
        ref={listOfNums2}
        numbers={Array.from({ length: 30 }, (_, i) => i)}
      />
      <Latex
        ref={formula}
        fill="white"
        opacity={0}
        tex={"{{n}} = {{n}} + {{1}}"}
        position={[0, -400]}
        fontSize={64}
      />
    </>
  );

  yield* waitFor(1);
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
        points={[screenToScene(listOfNums1().latexNums[i].absolutePosition())]}
        stroke={"lightseagreen"}
        lineWidth={4}
        arrowSize={16}
        endArrow
        startOffset={25}
        endOffset={25}
      />
    );
  }

  yield* all(
    ...arrows.map((line, i) =>
      line.points(
        [
          screenToScene(listOfNums1().latexNums[i].absolutePosition()),
          screenToScene(listOfNums2().latexNums[i].absolutePosition()),
        ],
        1.5,
        easeInOutCubic
      )
    )
  );

  yield* waitFor(1);

  yield* listOfNums2().latexNums[0].opacity(0, 1);
  yield* flashLine(arrows[0]);

  yield* waitFor(1);

  yield* arrows[0].points(
    [
      screenToScene(listOfNums1().latexNums[0].absolutePosition()),
      () => screenToScene(listOfNums2().latexNums[1].absolutePosition()),
    ],
    1.5,
    easeInOutCubic
  );

  yield* arrows[1].points(
    [
      screenToScene(listOfNums1().latexNums[1].absolutePosition()),
      () => screenToScene(listOfNums2().latexNums[2].absolutePosition()),
    ],
    1.5,
    easeInOutCubic
  );

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

  yield* formula().opacity(1, 1);

  yield* listOfNums2().position.x(listOfNums2().position.x() - 80, 1);

  yield* waitFor(1);

  yield* all(
    ...listOfNums2().latexNums.map((latex, i) => {
      return i % 2 == 0 ? latex.margin([40, 0, 0, 0], 1) : null;
    })
  );

  yield* all(
    ...listOfNums2().latexNums.map((latex, i) => {
      return i % 2 == 0 ? latex.opacity(0, 1) : null;
    })
  );

  yield* waitFor(1);

  //   yield* all(
  //     ...arrows.map((line, i) => {
  //       return i % 2 == 0 ? flashLine(line) : null;
  //     })
  //   );
});
