import {
  Img,
  Latex,
  Line,
  makeScene2D,
  Node,
  QuadBezier,
  Rect,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  makeRef,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import sheepPng from "../../../3d-stuff/images/sheep.png";
import applePng from "../../../3d-stuff/images/apple.png";
import pearPng from "../../../3d-stuff/images/pear.png";
import grassPng from "../../../3d-stuff/images/grass_patch.png";
import { randomInt, squishTransformAll } from "../utils/utils";

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];
  view.add(
    <>
      <Latex
        ref={makeRef(texts, 0)}
        fill={"white"}
        fontSize={70}
        tex={"\\text{Other examples}"}
        position={[0, -400]}
      />
      <Latex
        ref={makeRef(texts, 1)}
        fill={"white"}
        fontSize={64}
        tex={"\\mathbb{Z} = \\{..., -3,-2,-1,0,1,2,3,...\\}"}
        position={[-150, -200]}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 2)}
        fill={"white"}
        fontSize={64}
        tex={`\\left\\{
                \\begin{array}{l}
                a, aa, aaa, \\dots \\\\
                one, two, three, \\dots \\\\
                \\dots, Shakespeare, \\dots \\\\
                \\end{array}
                \\right\\}
        `}
        position={[300, 200]}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 3)}
        fill={"white"}
        fontSize={64}
        tex={
          "\\mathbb{Q} = \\{\\frac{1}{2}, \\frac{10}{6}, \\frac{3}{4}, \\dots \\}"
        }
        position={[-320, -50]}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 4)}
        fill={"white"}
        fontSize={64}
        tex={"\\mathbb{R} = \\{1, \\pi, \\frac{1}{2}, e\\}"}
        position={[-520, 200]}
        opacity={0}
      />
    </>
  );

  yield* slideTransition(Direction.Right, 1);

  yield* waitFor(1);
  yield* texts[1].opacity(1, 1, easeInOutCubic);
  yield* waitFor(3.5);
  yield* texts[2].opacity(1, 1, easeInOutCubic);

  yield* waitFor(1);
  yield* texts[3].opacity(1, 1, easeInOutCubic);
  yield* texts[4].opacity(1, 1, easeInOutCubic);

  yield* waitFor(2);
});
