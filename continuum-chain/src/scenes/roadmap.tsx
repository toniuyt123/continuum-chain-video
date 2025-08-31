import {
  Grid,
  Latex,
  Line,
  makeScene2D,
  Path,
  QuadBezier,
  Rect,
  Txt,
  Video,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  linear,
  makeRef,
  waitFor,
} from "@motion-canvas/core";

import video from "../video/two_idle_sheep.mp4";
import { createSubsetLattice } from "../components/SubsetLattice";
import { NumberLine } from "../components/NumberLine";

export default makeScene2D(function* (view) {
  const videoRef = createRef<Video>();
  const lineRef = createRef<Line>();
  const lattice = createSubsetLattice({
    set: [1, 2, 3],
    verticalGap: 75,
  });
  const sectors: Rect[] = [];
  const numberLineRef = createRef<NumberLine>();

  view.add(
    <>
      <Rect
        layout
        ref={makeRef(sectors, 0)}
        direction={"column"}
        position={[-450, -300]}
        alignItems={"center"}
      >
        <Txt text={"Counting Sheep"} fill={"white"} fontFamily={"Katex_Main"} />
        <Video
          ref={videoRef}
          src={video}
          width={480}
          height={270}
          loop={true}
        />
      </Rect>
      <Path
        ref={lineRef}
        lineWidth={10}
        stroke={"lightseagreen"}
        end={0}
        lineDash={[50, 25]}
        opacity={0.8}
        data={`M -1090 -372 C -900 -400 -671 -264 -429 -386 C -226 -496 202 -177 388 -341 C 509 -454 719 -361 779 -332 C 870 -282 900 0 774 2 C 700 0 600 -150 385 -102 C 200 -50 -131 -225 -294 -167 C -600 -50 -510 -99 -637 -80 C -800 -57 -825 48 -646 217 C -513 343 -372 41 -120 187 C 105 313 320 377 491 243 C 611 149 1100 100 1300 150 L 1400 200`}
      />
      <Rect
        layout
        direction={"column"}
        alignItems={"center"}
        gap={16}
        ref={makeRef(sectors, 1)}
        position={[575, -375]}
      >
        <Txt text={"Infinities"} fill={"white"} fontFamily={"Katex_Main"} />
        <Latex tex={"\\infty \\ \\ \\ \\mathbb{N}"} fill="white" />
        <Latex
          marginLeft={100}
          tex={"\\mathbb{Q} \\ \\ \\ \\mathbb{R}"}
          fill="white"
        />
      </Rect>
      <Rect ref={makeRef(sectors, 2)} position={[-100, -100]}>
        <Txt
          text={"Density of Rationals"}
          fill={"white"}
          fontFamily={"Katex_Main"}
        />
        <NumberLine
          ref={numberLineRef}
          position={[0, 100]}
          points={[
            [-500 / 2, 0],
            [500 / 2, 0],
          ]}
          lineWidth={6}
          stroke={"white"}
          startArrow
          endArrow
          start={0.5}
          end={0.5}
          centerOffset={-150}
          lineScale={300}
        />
      </Rect>
      <Rect ref={makeRef(sectors, 3)} position={[-450, 180]}>
        <Txt text={"The Power Set"} fill={"white"} fontFamily={"Katex_Main"} />
        {lattice.node}
      </Rect>
      <Rect ref={makeRef(sectors, 4)} position={[360, 200]}>
        <Txt
          text={"The Continuum Chain"}
          fill={"white"}
          fontFamily={"Katex_Main"}
        />
      </Rect>
    </>
  );

  videoRef().play();
  sectors.forEach((sector) => {
    sector.opacity(0);
  });
  lattice.node.position([0, 290]);

  yield* all(
    lineRef().end(1, 10, linear),
    delay(1, sectors[0].opacity(1, 2)),
    delay(2, sectors[1].opacity(1, 2)),
    delay(4.5, sectors[2].opacity(1, 2)),
    delay(
      4.7,
      all(
        numberLineRef().start(0, 1, easeInOutCubic),
        numberLineRef().end(1, 1, easeInOutCubic),
        numberLineRef().addNumber(0),
        numberLineRef().addNumber(1),
        delay(1, numberLineRef().populateBetween(0, 1, 5, 0.1, 0.1, 2))
      )
    ),
    delay(6, sectors[3].opacity(1, 2)),
    delay(6, lattice.animate()),
    delay(8, sectors[4].opacity(1, 2))
  );
  yield* waitFor(3);
});
