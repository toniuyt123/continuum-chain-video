import { Circle, Grid, Img, Latex, makeScene2D, Rect } from "@motion-canvas/2d";
import {
  all,
  createRef,
  makeRef,
  sequence,
  waitFor,
} from "@motion-canvas/core";
import { randomPastelColor } from "../utils/utils";

import img from "../imgs/thumbnail.png";
export default makeScene2D(function* (view) {
  view.add(
    <>
      {/* <Img src={img} /> */}
      <Rect
        layout
        direction={"column"}
        position={[0, -300]}
        gap={40}
        alignItems={"center"}
      >
        <Latex tex={"\\text{Continuum Chain}"} fill={"white"} fontSize={140} />
        <Latex
          tex={"\\text{in } \\mathcal{P}(\\mathbb{N})"}
          fill={"white"}
          fontSize={140}
        />
      </Rect>
    </>
  );

  yield* waitFor(1);
});
