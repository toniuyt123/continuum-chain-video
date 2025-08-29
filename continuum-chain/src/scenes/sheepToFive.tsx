import { Img, Latex, Line, makeScene2D, Node } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInOutCubic,
  makeRef,
  sequence,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import sheepPng from "../../../3d-stuff/images/sheep.png";
import applePng from "../../../3d-stuff/images/apple.png";
import pearPng from "../../../3d-stuff/images/pear.png";
import { randomInt, squishTransformAll } from "../utils/utils";

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
          <Img src={sheepPng} scale={0.2} />
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
          points={() => [leftNodes[i].position(), rightNodes[i].position()]}
        />
        <Node
          ref={makeRef(rightNodes, i)}
          position={rightStartingPoint.add(offset.scale(i))}
        >
          <Img src={pearPng} scale={0} />
          <Latex tex={`\\text${i + 1}`} fill={"white"} fontSize={64} />
        </Node>
      </>
    );
  }

  yield* waitFor(2.2);
  yield* headingText().tex(["\\text{Counting}"], 1.5);

  yield* waitFor(2.5);
  yield* headingText().tex(
    ["\\text{Bijection }", "=", "1\\text{-}1\\text{ mapping}"],
    1,
    easeInOutCubic
  );

  yield* waitFor(3);

  yield* squishTransformAll(leftNodes, (node) => {
    (node.children()[0] as Img).src(applePng);
  });

  yield* squishTransformAll(rightNodes, (node) => {
    (node.children()[0] as Img).src(pearPng).scale(0.12);
    node.children()[1].scale(0);
  });

  yield* waitFor(0.3);

  yield* squishTransformAll(leftNodes.concat(rightNodes), (node) => {
    node.children()[0].scale(0);
    (node.children()[1] as Latex).tex(`\\text{${randomInt(10, 50)}}`).scale(1);
  });

  yield* waitFor(2);
  yield* headingText().tex(
    ["\\text{Set}", "=", "\\text{Collection of objects}"],
    1.5,
    easeInOutCubic
  );

  yield* waitFor(7);
  yield* headingText().tex(
    ["\\text{Denoted by } \\mathbb{N}", "=", "\\{1,2,3,4...\\}"],
    1.5,
    easeInOutCubic
  );

  yield* waitFor(5.5);

  yield* squishTransformAll(leftNodes, (node) => {
    (node.children()[0] as Img).src(sheepPng).scale(0.2);
    node.children()[1].scale(0);
  });

  yield* waitFor(1);

  yield* squishTransformAll(rightNodes, (node, i) => {
    (node.children()[1] as Latex).tex(`\\text{${i == 2 ? 5 : ""}}`);
  });

  yield* waitFor(3);
  yield* headingText().tex(
    ["\\text{Bijection }", "=", "1\\text{-}1\\text{ mapping}"],
    1.5,
    easeInOutCubic
  );

  yield* waitFor(2);
  yield* squishTransformAll(rightNodes, (node) => {
    (node.children()[0] as Img).src(sheepPng).scale(0.2);
    node.children()[1].scale(0);
  });

  yield* waitFor(1);
  yield* sequence(
    0.3,
    ...arrows.map((arrow) =>
      sequence(
        0.6,
        arrow.scale(1.05, 0.3, easeInOutCubic),
        arrow.scale(1, 0.3, easeInOutCubic)
      )
    )
  );

  yield* waitFor(1);
  yield* squishTransformAll(rightNodes, (node, i) => {
    node.children()[0].scale(0);
    (node.children()[1] as Latex).tex(`\\text{${i == 2 ? 5 : ""}}`).scale(1);
  });

  yield* waitFor(2.5);
  yield* all(
    ...arrows.map((arrow) =>
      arrow.points(
        [arrow.points()[0], rightNodes[2].position()],
        1.5,
        easeInOutCubic
      )
    )
  );

  yield* waitFor(10.5);
  yield* all(
    headingText().tex(
      ["5", "=", "\\{0,1,2,3,4", "", "\\}"],
      1.5,
      easeInOutCubic
    ),
    squishTransformAll(rightNodes, (node, i) => {
      (node.children()[1] as Latex).tex(`\\text{${i}}`).scale(1);
    })
  );

  yield* waitFor(6);
  yield* all(
    ...arrows.map((arrow, i) =>
      arrow.points(
        [arrow.points()[0], rightNodes[i].position()],
        1.5,
        easeInOutCubic
      )
    )
  );

  yield* waitFor(2);
  yield* headingText().tex(
    ["6", "=", "\\{0,1,2,3,4", ",5", "\\}"],
    1.5,
    easeInOutCubic
  );
  yield* waitFor(2);
  yield* headingText().tex(
    ["n", "=", "\\{0,1,2,3,4", ",\\dots,n-1", "\\}"],
    2,
    easeInOutCubic
  );

  yield* waitFor(3);
});
