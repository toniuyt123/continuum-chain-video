import { Grid, Latex, Line, makeScene2D, Rect, Video } from "@motion-canvas/2d";
import {
  all,
  createRef,
  delay,
  Direction,
  easeInOutCubic,
  makeRef,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import video from "../../../3d-stuff/video_output/confusedSHepherd.mp4";
import { NatRatTable } from "../components/NatRatTable";

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];
  const tableRef = createRef<NatRatTable>();
  const listAdd = createRef<Rect>();
  const arrows: Line[] = [];
  const setsText: Latex[] = [];
  const setArrows: Line[] = [];
  const sects = createRef<Rect>();

  view.add(
    <>
      <NatRatTable ref={tableRef} position={[-400, -150]} appeared={true} />
      <Rect
        layout
        direction={"column"}
        gap={20}
        position={[-400, 350]}
        alignItems={"center"}
      >
        <Rect layout gap={25} alignItems={"center"}>
          <Latex
            ref={makeRef(setsText, setsText.length)}
            tex={"\\{\\frac{1}{2},\\frac{3}{2},\\frac{2}{3}\\}"}
            fill={"white"}
            fontSize={30}
            opacity={0}
          />
          <Line
            ref={makeRef(setArrows, setArrows.length)}
            points={[
              [0, 0],
              [200, 0],
            ]}
            stroke={"white"}
            lineWidth={4}
            arrowSize={16}
            endArrow
            end={0}
          />
          <Latex
            ref={makeRef(setsText, setsText.length)}
            tex={"\\{1,7,8\\}"}
            fill={"white"}
            opacity={0}
          />
        </Rect>
        <Rect
          ref={sects}
          layout
          justifyContent={"space-between"}
          marginLeft={50}
          marginRight={50}
          opacity={0}
        >
          <Latex tex={"\\cap"} fill={"white"} fontSize={40} />
          <Rect width={400} />
          <Latex tex={"\\cap"} fill={"white"} fontSize={40} />
        </Rect>
        <Rect layout gap={25} alignItems={"center"} position={[-400, 300]}>
          <Latex
            ref={makeRef(setsText, setsText.length)}
            tex={"\\{\\frac{1}{2},\\frac{3}{2},\\frac{2}{3}, \\frac{1}{3}\\}"}
            fill={"white"}
            fontSize={30}
            opacity={0}
          />
          <Line
            ref={makeRef(setArrows, setArrows.length)}
            points={[
              [0, 0],
              [200, 0],
            ]}
            stroke={"white"}
            lineWidth={4}
            arrowSize={16}
            endArrow
            end={0}
          />
          <Latex
            ref={makeRef(setsText, setsText.length)}
            tex={"\\{1,7,8,3\\}"}
            fill={"white"}
            opacity={0}
          />
        </Rect>
      </Rect>

      <Rect
        ref={listAdd}
        position={[400, 0]}
        layout
        direction={"column"}
        gap={25}
        fontSize={30}
      ></Rect>
    </>
  );
  tableRef().arrows.map((arrow) => arrow.end(1));

  yield* slideTransition(Direction.Left, 1);

  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      listAdd().add(
        <Rect layout gap={25} alignItems={"center"}>
          <Latex
            ref={makeRef(texts, texts.length)}
            tex={`\\frac{${i}}{${j}}`}
            fill={"white"}
            fontSize={30}
            opacity={0}
          />
          <Line
            ref={makeRef(arrows, arrows.length)}
            points={[
              [0, 0],
              [200, 0],
            ]}
            stroke={"white"}
            lineWidth={4}
            arrowSize={16}
            endArrow
            end={0}
          />
          <Latex
            ref={makeRef(texts, texts.length)}
            tex={`${tableRef().rowColToN(i - 1, j - 1)}`}
            fill={"white"}
            opacity={0}
          />
        </Rect>
      );
    }
  }
  yield* waitFor(4);
  yield* texts[0].opacity(1, 1);
  yield* arrows[0].end(1, 0.5, easeInOutCubic);
  yield* texts[1].opacity(1, 1);

  yield* sequence(
    0.3,
    ...arrows
      .slice(1)
      .map((arrow, i) =>
        all(
          texts[(i + 1) * 2].opacity(1, 1),
          delay(0.5, arrow.end(1, 0.5, easeInOutCubic)),
          delay(0.7, texts[(i + 1) * 2 + 1].opacity(1, 1))
        )
      )
  );

  yield* waitFor(2);
  yield* setsText[0].opacity(1, 1);
  yield* setArrows[0].end(1, 0.5, easeInOutCubic);
  yield* setsText[1].opacity(1, 1);

  yield* waitFor(2);
  yield* sects().opacity(1, 1);
  yield* setsText[2].opacity(1, 1);
  yield* setArrows[1].end(1, 0.5, easeInOutCubic);
  yield* setsText[3].opacity(1, 1);

  // yield* texts[0].opacity(1, 1);
  yield* waitFor(7);
});
