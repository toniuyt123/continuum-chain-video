import {
  Img,
  Latex,
  Line,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  Direction,
  easeInOutCubic,
  makeRef,
  slideTransition,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import sheepPng from "../../../3d-stuff/images/sheep.png";
import pearPng from "../../../3d-stuff/images/pear.png";
import { squishTransformAll } from "../utils/utils";

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];
  view.add(
    <>
      <Latex
        ref={makeRef(texts, 0)}
        fill={"white"}
        fontSize={70}
        tex={"\\text{When is something finite?}"}
        position={[0, -400]}
      />
      <Rect>
        <Txt
          ref={makeRef(texts, 1)}
          fill={"white"}
          fontSize={56}
          textAlign={"center"}
          fontFamily={"Katex_Main"}
          text={
            "A set is finite if and only if it can be put in one-to-one correspondence with some natural number."
          }
          position={[0, -200]}
          textWrap={true}
          opacity={0}
        />
      </Rect>
    </>
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* texts[1].opacity(1, 1.5, easeInOutCubic);

  yield* waitFor(3);

  const sheeps = 4;
  const startingPoint = new Vector2(-500, -50);
  const rightStartingPoint = new Vector2(-startingPoint.x, startingPoint.y);
  const offset = createSignal(new Vector2(0, 150));
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
          opacity={0}
          ref={makeRef(leftNodes, i)}
          position={() => startingPoint.add(offset().scale(i))}
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
          end={0}
          points={() => [leftNodes[i].position(), rightNodes[i].position()]}
        />
        <Node
          opacity={0}
          ref={makeRef(rightNodes, i)}
          position={() => rightStartingPoint.add(offset().scale(i))}
        >
          <Img src={pearPng} scale={0} />
          <Latex tex={`\\text${i}`} fill={"white"} fontSize={64} />
        </Node>
      </>
    );
  }

  const addRow = function* (
    leftText: string,
    rightText: string,
    offsetDecrease: number,
    arrowOpacity = 1
  ) {
    const currentSize = leftNodes.length;
    const node = createRef<Node>();
    view.add(
      <Node ref={node} opacity={0}>
        <Node
          opacity={1}
          ref={makeRef(leftNodes, currentSize)}
          position={() => startingPoint.add(offset().scale(currentSize))}
        >
          <Latex fill={"white"} tex={leftText} fontSize={64} />
        </Node>
        <Line
          endArrow
          ref={makeRef(arrows, currentSize)}
          stroke={"lightseagreen"}
          startOffset={100}
          endOffset={100}
          lineWidth={6}
          arrowSize={16}
          end={1}
          opacity={arrowOpacity}
          points={() => [
            leftNodes[currentSize].position(),
            rightNodes[currentSize].position(),
          ]}
        />
        <Node
          opacity={1}
          ref={makeRef(rightNodes, currentSize)}
          position={() => rightStartingPoint.add(offset().scale(currentSize))}
        >
          <Latex tex={rightText} fill={"white"} fontSize={64} />
        </Node>
      </Node>
    );

    yield* all(
      offset(offset().sub(new Vector2(0, offsetDecrease)), 1, easeInOutCubic),
      node().opacity(1, 1, easeInOutCubic)
    );
  };

  yield* all(
    ...leftNodes.map((node) => node.opacity(1, 1, easeInOutCubic)),
    ...rightNodes.map((node) => node.opacity(1, 1, easeInOutCubic))
  );
  yield* all(...arrows.map((arrow) => arrow.end(1, 1, easeInOutCubic)));

  yield* waitFor(1);
  yield* all(
    squishTransformAll(leftNodes, (node, i) => {
      (node.children()[1] as Latex).tex(`${i}`);
      node.children()[0].scale(0);
    })
  );
  yield* addRow("\\vdots", "\\vdots", 50, 0.5);

  yield* waitFor(2);
  yield* addRow("10000", "10000", 10);
  yield* addRow("\\vdots", "\\vdots", 0, 0.5);

  yield* waitFor(2);

  const offscreenArrows: Line[] = [];
  for (let i = 0; i < 6; i++) {
    view.add(
      <Line
        endArrow
        ref={makeRef(offscreenArrows, i)}
        stroke={"lightseagreen"}
        startOffset={100}
        endOffset={100}
        lineWidth={6}
        arrowSize={16}
        end={1}
        points={() => [
          leftNodes[leftNodes.length - 1].position().add(offset().scale(i + 1)),
          rightNodes[rightNodes.length - 1]
            .position()
            .add(offset().scale(i + 1)),
        ]}
      />
    );
  }

  yield* waitFor(1);
  yield* all(
    ...[arrows[arrows.length - 1], ...offscreenArrows].map((arrow) =>
      arrow.points(
        [arrow.points()[0], rightNodes[rightNodes.length - 2].position()],
        1,
        easeInOutCubic
      )
    )
  );

  yield* waitFor(3);
});
