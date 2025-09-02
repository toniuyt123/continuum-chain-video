import {
  Circle,
  Latex,
  Layout,
  Line,
  makeScene2D,
  Node,
  Rect,
  View2D,
} from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  makeRef,
  range,
  sequence,
  slideTransition,
  useLogger,
  useScene,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { arrApplyGradual, pulseNode } from "../utils/utils";
import powerSetIntroduction from "./powerSetIntroduction";
import { NatRatTable } from "../components/NatRatTable";

function screenToScene(screenCoords: Vector2): Vector2 {
  const viewSize = useScene().getSize();
  return new Vector2(
    screenCoords.x - viewSize.x / 2,
    screenCoords.y - viewSize.y / 2
  );
}

function generateRandomNumberString(length: number): string {
  let result = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * digits.length)];
  }
  return result;
}

function addArrow(to: Node, startNode: Node, endNode: Node, ref: any): Node {
  return to.add(
    <Line
      endArrow
      ref={ref}
      stroke={"lightseagreen"}
      startOffset={50}
      endOffset={50}
      lineWidth={6}
      arrowSize={16}
      end={0}
      points={() => [
        screenToScene(startNode.absolutePosition()),
        screenToScene(endNode.absolutePosition()),
      ]}
    />
  );
}

function textFromRowAndCol(row: number, col: number): string {
  if (row === 0 && col === 0) {
    return "";
  }
  if (row === 0) {
    return `${col}`;
  }
  if (col === 0) {
    return `${row}`;
  }

  return `\\frac{${row}}{${col}}`;
}

export default makeScene2D(function* (view) {
  const tableRef = createRef<NatRatTable>();
  const texts: Latex[] = [];
  const textsRect = createRef<Rect>();

  view.add(
    <Rect
      ref={textsRect}
      layout
      direction={"column"}
      gap={100}
      alignItems={"center"}
      position={[0, -200]}
    >
      <Latex
        ref={makeRef(texts, 0)}
        tex={["\\text{Denoted by } \\mathbb{Q}"]}
        fill={"white"}
        opacity={0}
      />

      <Latex
        ref={makeRef(texts, 1)}
        tex={["\\frac{1}{2}"]}
        fill={"white"}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 2)}
        tex={["|\\mathbb{Q}| > |\\mathbb{N}| ?"]}
        fill={"white"}
        opacity={0}
      />
    </Rect>
  );
  yield* waitFor(7);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[0].tex(
    texts[0]
      .tex()
      .concat([, "= \\{\\frac{p}{q} \\mid p, q \\text{ are integers}\\}"]),
    1
  );
  yield* waitFor(4);
  yield* texts[1].opacity(1, 1);
  yield* waitFor(0.6);
  yield* texts[1].tex(texts[1].tex().concat([, ", \\frac{4}{5}"]), 1);
  yield* texts[1].tex(texts[1].tex().concat([, ", \\frac{10}{13}"]), 1);
  yield* texts[1].tex(texts[1].tex().concat([, ", \\frac{22}{7}"]), 1);
  yield* texts[1].tex(texts[1].tex().concat([, ", \\dots"]), 1);
  yield* texts[2].opacity(1, 1);
  yield* waitFor(5);
  yield* all(
    ...texts.slice(1).map((text) => text.opacity(0, 1)),
    textsRect().position.y(-250, 1)
  );

  view.add(<NatRatTable ref={tableRef} />);
  yield* waitFor(2);
  yield* tableRef().appear();
  yield* all(...tableRef().rowHeaders.map((header) => pulseNode(header, 1.5)));
  yield* waitFor(1);
  yield* all(...tableRef().colHeaders.map((header) => pulseNode(header, 1.5)));

  const arrows: Line[] = [];
  view.add(
    <>
      <Line
        ref={makeRef(arrows, 0)}
        endArrow
        stroke={"lightseagreen"}
        lineWidth={6}
        arrowSize={16}
        end={0}
        points={[
          [-200, -180],
          [300, -180],
        ]}
      />

      <Line
        ref={makeRef(arrows, 1)}
        endArrow
        stroke={"lightseagreen"}
        lineWidth={6}
        arrowSize={16}
        end={0}
        points={[
          [-200, -180],
          [-200, 300],
        ]}
      />
    </>
  );

  yield* waitFor(2);
  yield* arrows[0].end(1, 1, easeInOutCubic);
  yield* arrows[1].end(1, 1, easeInOutCubic);
  yield* waitFor(2);
  yield* all(
    arrows[0].end(0, 1, easeInOutCubic),
    arrows[1].end(0, 1, easeInOutCubic)
  );

  yield* waitFor(3);
  yield* sequence(
    0.15,
    ...tableRef().arrows.map((arrow) => arrow.end(1, 0.15, easeInOutCubic))
  );
  yield* waitFor(3);
  yield* arrApplyGradual(
    tableRef().numbers,
    (num, i) =>
      all(
        num.fill("lightseagreen", 0.15),
        num.tex(i.toString(), 0.15, easeInOutCubic)
      ),
    2
  );

  yield* waitFor(3);
});
