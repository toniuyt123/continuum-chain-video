import {
  Circle,
  Latex,
  Line,
  makeScene2D,
  Node,
  Path,
  Rect,
} from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  linear,
  makeRef,
  sequence,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";
import { pulseNode, randomInt, randomPastelColor } from "../utils/utils";

export default makeScene2D(function* (view) {
  const lattice = createSubsetLattice({
    set: [1, 2, 3, 4],
    levelDelay: 1,
    renderUpToLevel: 3,
    horizontalGap: 150,
    labelTransform: (label, levelIndex, i, levelWidth) =>
      i == levelWidth - 1 || levelIndex == 2 ? "\\dots" : `${label}`,
  });

  // Add the lattice node to the scene
  view.add(lattice.node);
  lattice.node.scale(1.5);
  lattice.node.position([0, 479]);

  yield* slideTransition(Direction.Bottom, 1);
  // Run its animation
  yield* lattice.animate(1);

  const secondLattice = createSubsetLattice({
    set: [1, 2, 3, 4],
    renderUpToLevel: 3,
    verticalGap: -100,
    horizontalGap: 150,
    levelDelay: 1,
    reverseLevels: true,
    startingTex: "\\mathbb{N}",
    labelTransform: (label, levelIndex, i, levelWidth) =>
      i == 0 || levelIndex == 2 ? "\\dots" : `\\mathbb{N} \\setminus ${label}`,
  });
  view.add(secondLattice.node);
  secondLattice.node.scale(1.5);
  secondLattice.node.position([0, -479]);

  yield* secondLattice.animate(1);

  const lines: Line[] = [];
  view.add(
    <>
      <Line
        ref={makeRef(lines, 0)}
        points={[lattice.node.position(), secondLattice.node.position()]}
        stroke="lightseagreen"
        lineWidth={8}
        endArrow
        startArrow
        start={0.5}
        end={0.5}
      />
      <Line
        ref={makeRef(lines, 1)}
        points={[
          [-700, 0],
          [700, 0],
        ]}
        stroke="lightseagreen"
        lineWidth={8}
        endArrow
        startArrow
        start={0.5}
        end={0.5}
      />
    </>
  );

  yield* waitFor(2.5);
  yield* all(lines[1].start(0, 1), lines[1].end(1, 1));
  yield* all(lines[0].start(0, 1), lines[0].end(1, 1));
  yield* waitFor(0.5);

  yield* all(
    lines[0].start(0.5, 1),
    lines[0].end(0.5, 1),
    lines[1].start(0.5, 1),
    lines[1].end(0.5, 1)
  );

  yield* waitFor(2);
  yield* all(
    ...lattice.latexRefs[1].map((node) => pulseNode(node(), 1.3, 0.5, 3))
  );
  yield* all(
    ...lattice.latexRefs[2].map((node) => pulseNode(node(), 1.3, 0.5, 3))
  );

  yield* waitFor(4);
  yield* all(
    ...secondLattice.latexRefs[1].map((node) => pulseNode(node(), 1.3, 0.5, 3))
  );
  yield* waitFor(0.5);
  yield* all(
    ...secondLattice.latexRefs[2].map((node) => pulseNode(node(), 1.3, 0.5, 3))
  );

  const middleEllipse = createRef<Path>();
  const middlePath = createRef<Path>();
  view.add(
    <>
      <Path
        ref={middleEllipse}
        data="M 0,100 a 400,100 0 1,0 0,-200 a 400,100 0 1,0 0,200"
        stroke="lightseagreen"
        lineWidth={8}
        end={0}
      />
      <Path
        ref={middlePath}
        data="M 0,479 Q 100,300 0,200 T 0,100 T 0,0 T 0,-100 T 0,-200 T 0,-300 T 0,-479"
        stroke="lightseagreen"
        endArrow
        lineDash={[20, 20]}
        startOffset={35}
        endOffset={35}
        lineWidth={10}
        end={0}
      />
    </>
  );
  yield* waitFor(1);
  yield* middleEllipse().end(1, 2, easeInOutCubic);
  yield* waitFor(11);

  const middleTexts: Latex[] = [];
  view.add(
    <>
      <Latex
        ref={makeRef(middleTexts, 0)}
        tex={"\\{2,4,6,\\dots\\}"}
        fill={"lightseagreen"}
        opacity={0}
        position={[-200, 0]}
      />

      <Latex
        ref={makeRef(middleTexts, 1)}
        tex={"\\{2,5,7,\\dots\\}"}
        fill={"lightseagreen"}
        opacity={0}
        position={[200, 0]}
      />
    </>
  );
  yield* middleTexts[0].opacity(1, 1);
  yield* middleTexts[1].opacity(1, 1);

  yield* waitFor(1.5);
  yield* all(
    middleTexts[0].opacity(0, 1),
    middleTexts[1].opacity(0, 1),
    middleEllipse().opacity(0, 1)
  );

  yield* middlePath().end(1, 3, linear);
  yield* waitFor(4);
  yield* pulseNode(lattice.emptyLatex(), 1.3, 0.5, 1);
  yield* waitFor(1);
  yield* pulseNode(secondLattice.emptyLatex(), 1.3, 0.5, 1);

  yield* waitFor(3);
  view.add(
    <Latex
      ref={makeRef(middleTexts, 2)}
      tex={"{{\\text{Countable}}} + 1?"}
      fill={"white"}
      position={[500, -450]}
      opacity={0}
    />
  );
  yield* middleTexts[2].opacity(1, 1);
  yield* waitFor(0.5);
  yield* all(middleTexts[2].tex("{{\\text{Countable}}}", 1));
  yield* waitFor(3);
  yield* middlePath().opacity(0, 1);

  const highlightChain = function* (timeBetween: number = 0.5) {
    const highlighColor = "#f0492cff";
    for (
      let levelIndex = 0;
      levelIndex < lattice.lineRefs.length;
      levelIndex++
    ) {
      const levelLines = lattice.lineRefs[levelIndex];
      const line = levelLines[0][0]; // Get the first line of the first subset for this level
      yield* all(
        line().stroke(highlighColor, timeBetween, easeInOutCubic),
        lattice.latexRefs[levelIndex][0]().fill(
          highlighColor,
          timeBetween,
          easeInOutCubic
        )
      );
    }
    for (let levelIndex = 2; levelIndex >= 0; levelIndex--) {
      const levelLines = secondLattice.lineRefs[levelIndex];
      const line = levelLines[0][0]; // Get the first line of the first subset for this level
      yield* all(
        line().stroke(highlighColor, timeBetween, easeInOutCubic),
        secondLattice.latexRefs[levelIndex][0]().fill(
          highlighColor,
          timeBetween,
          easeInOutCubic
        )
      );
    }
  };
  yield* highlightChain();

  yield* waitFor(5.5);
  yield* middleTexts[2].tex(
    "\\text{Un}{{\\text{Countable}}} \\text{ chain??}",
    1
  );

  yield* waitFor(3);

  yield* all(
    ...lattice.lineRefs
      .concat(secondLattice.lineRefs)
      .map((lines) => lines[0][0]().stroke("darkgray", 1)),
    ...lattice.latexRefs
      .concat(secondLattice.latexRefs)
      .map((latex) => latex[0]().fill("white", 1))
  );
  yield* highlightChain(1);

  yield* waitFor(5);

  middleEllipse().data(
    "M 0,0 m -800,0 a 800,525 0 1,0 1600,0 a 800,525 0 1,0 -1600,0"
  );
  middleEllipse().opacity(1);
  middleEllipse().end(0);
  yield* middleEllipse().end(1, 2, easeInOutCubic);
  yield* waitFor(3);

  const window = createRef<Rect>();
  view.add(
    <>
      <Rect
        ref={window}
        fill={"rgb(27,27,27)"}
        width={1200}
        height={800}
        opacity={0}
        radius={50}
        stroke={"rgba(10,10,10,1)"}
        lineWidth={8}
      ></Rect>
    </>
  );

  yield* window().opacity(0.95, 1);
  yield* waitFor(1);

  const circles: Circle[] = [];
  const intersectingCircles: Circle[] = [];
  for (let i = 3; i >= 0; i--) {
    view.add(
      <>
        <Circle
          ref={makeRef(circles, i)}
          size={150 + i * 200}
          fill={randomPastelColor()}
          stroke={"black"}
          lineWidth={6}
          opacity={0}
        >
          <Latex
            tex={i == 3 ? "\\dots" : `S_${i + 1}`}
            fill={"black"}
            position={[110 * i, 0]}
          />
        </Circle>
      </>
    );
  }
  for (let i = 0; i < 10; i++) {
    view.add(
      <>
        <Circle
          ref={makeRef(intersectingCircles, i)}
          size={300 + randomInt(-100, 100)}
          fill={randomPastelColor()}
          stroke={"black"}
          lineWidth={6}
          opacity={0}
          position={[randomInt(-200, 200), randomInt(-200, 200)]}
        >
          <Latex tex={`S_{${i + 1}}`} fill={"black"} />
        </Circle>
      </>
    );
  }

  yield* sequence(0.5, ...circles.map((circle) => circle.opacity(1, 1)));
  yield* waitFor(4);
  yield* all(...circles.map((circle) => circle.opacity(0, 1)));
  yield* sequence(
    0.3,
    ...intersectingCircles.map((circle) => circle.opacity(0.8, 1))
  );
  yield* waitFor(2.5);
});
