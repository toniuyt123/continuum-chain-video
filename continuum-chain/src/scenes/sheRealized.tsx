import {
  Grid,
  Img,
  Latex,
  Line,
  makeScene2D,
  Node,
  Rect,
  Video,
} from "@motion-canvas/2d";
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
import sheepPng from "../../../3d-stuff/images/sheep.png";
import { squishTransformAll } from "../utils/utils";

export default makeScene2D(function* (view) {
  const sheeps = 5;
  const startingPoint = new Vector2(-500, -250);
  const rightStartingPoint = new Vector2(-startingPoint.x, startingPoint.y);
  const offset = new Vector2(0, 150);

  const leftNodes: Node[] = [];
  const rightNodes: Node[] = [];
  const arrows: Line[] = [];

  const headingText = createRef<Latex>();
  view.add(
    <Latex
      ref={headingText}
      fill={"white"}
      position={[0, -400]}
      fontSize={64}
    />
  );

  for (let i = 0; i < sheeps; i++) {
    view.add(
      <>
        <Node
          ref={makeRef(leftNodes, i)}
          position={startingPoint.add(offset.scale(i))}
        >
          <Img src={sheepPng} scale={0} />
          <Latex fill={"white"} fontSize={64} />
        </Node>
        <Line
          endArrow
          ref={makeRef(arrows, i)}
          stroke={"lightseagreen"}
          startOffset={100}
          endOffset={100}
          lineWidth={6}
          arrowSize={16}
          end={0}
          points={() => [leftNodes[i].position(), rightNodes[i].position()]}
        />
        <Node
          ref={makeRef(rightNodes, i)}
          position={rightStartingPoint.add(offset.scale(i))}
        >
          <Img src={sheepPng} scale={0} />

          <Rect width={250} layout justifyContent={"center"}>
            <Latex tex={``} fill={"white"} fontSize={64} />
          </Rect>
        </Node>
      </>
    );
  }

  const rightLatexes = rightNodes.map(
    (node) => node.children()[1].children()[0] as Latex
  );

  yield* slideTransition(Direction.Right, 1);

  yield* waitFor(0.5);
  yield* sequence(
    0.5,
    squishTransformAll(leftNodes, (node) => {
      node.children()[0].scale(0.2);
    }),
    squishTransformAll(rightNodes, (node) => {
      node.children()[0].scale(0.2);
    })
  );
  yield* all(...arrows.map((line) => line.end(1, 1)));

  yield* waitFor(4);
  yield* squishTransformAll(rightNodes, (node, i) => {
    node.children()[0].scale(0);
    rightLatexes[i].tex(`{{${i + 1}}}`);
  });
  yield* waitFor(0.5);
  yield* headingText().tex(['\\text{"numbers"}'], 1.5);

  yield* waitFor(1.5);

  yield* all(
    ...arrows.map((arrow) => arrow.endOffset(150, 2)),
    sequence(
      0.3,
      rightLatexes[0].tex(["{{1}} \\text{ one}"], 1),
      rightLatexes[1].tex(["{{2}} \\text{ two}"], 1),
      rightLatexes[2].tex(["{{3}} \\text{ three}"], 1),
      rightLatexes[3].tex(["{{4}} \\text{ four}"], 1),
      rightLatexes[4].tex(["{{5}} \\text{ five}"], 1)
    )
  );

  yield* waitFor(10);
  yield* headingText().tex(
    ["\\text{Denoted by } \\mathbb{N}", "=", "\\{1,2,3,4...\\}"],
    1.5
  );
  yield* all(
    ...arrows.map((arrow) => arrow.endOffset(100, 2)),
    ...rightLatexes.map((latex, i) => latex.tex(`{{${i + 1}}}`, 1))
  );
  yield* waitFor(0.5);
});
