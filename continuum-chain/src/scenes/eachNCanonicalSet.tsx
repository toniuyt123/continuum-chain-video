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
  easeInOutCubic,
  makeRef,
  sequence,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import sheepPng from "../../../3d-stuff/images/sheep.png";
import applePng from "../../../3d-stuff/images/apple.png";
import pearPng from "../../../3d-stuff/images/pear.png";
import grassPng from "../../../3d-stuff/images/grass_patch.png";
import { randomInt, squishTransformAll } from "../utils/utils";

export default makeScene2D(function* (view) {
  const sets: Latex[] = [];

  view.add(
    <Rect layout direction={"column"} gap={100} position={[-400, 0]}>
      <Latex
        ref={makeRef(sets, 0)}
        tex={"1 = \\{0\\}"}
        fill={"white"}
        opacity={0}
      />
      <Latex
        ref={makeRef(sets, 1)}
        tex={"3 = \\{0,1,2\\}"}
        fill={"white"}
        opacity={0}
      />
      <Latex
        ref={makeRef(sets, 2)}
        tex={"6 = \\{0,1,2,3,4,5\\}"}
        fill={"white"}
        opacity={0}
      />
      <Latex
        ref={makeRef(sets, 3)}
        tex={"10 = \\{0,1,2,3,4,5,6,7,8,9\\}"}
        fill={"white"}
        opacity={0}
      />
    </Rect>
  );

  yield* sequence(2, ...sets.map((set) => set.opacity(1, 1, easeInOutCubic)));

  const sheep = createRef<Node>();
  const apples = createRef<Node>();
  const bezier = createRef<QuadBezier>();
  const bezier2 = createRef<QuadBezier>();
  view.add(
    <>
      <Node ref={sheep} position={[0, -200]} opacity={0}>
        <Img src={grassPng} scale={[0.3, 0.4]} position={[0, 50]} />
        <Img src={sheepPng} scale={0.2} position={[-90, 15]} />
        <Img src={sheepPng} scale={0.2} position={[0, -50]} />
        <Img src={sheepPng} scale={0.2} position={[100, 40]} />
      </Node>
      <Node ref={apples} position={[300, 200]} opacity={0}>
        <Img src={applePng} scale={0.15} position={[0, 0]} />
        <Img src={applePng} scale={0.15} position={[-70, -70]} />
        <Img src={applePng} scale={0.15} position={[70, -70]} />
        <Img src={applePng} scale={0.15} position={[140, 0]} />
        <Img src={applePng} scale={0.15} position={[210, -70]} />
        <Img src={applePng} scale={0.15} position={[280, 0]} />
      </Node>
      <QuadBezier
        ref={bezier}
        lineWidth={10}
        startOffset={100}
        endArrow
        stroke={"lightseagreen"}
        p0={sheep().position()}
        p1={[-300, -450]}
        p2={[-450, -100]}
        end={0}
      />
      <QuadBezier
        ref={bezier2}
        lineWidth={10}
        startOffset={200}
        endArrow
        stroke={"lightseagreen"}
        p0={apples().position()}
        p1={[-50, -200]}
        p2={[-300, 50]}
        end={0}
      />
    </>
  );

  yield* waitFor(3);
  yield* sheep().opacity(1, 1, easeInOutCubic);
  yield* waitFor(1);
  yield* apples().opacity(1, 1, easeInOutCubic);
  yield* waitFor(1);

  yield* bezier().end(1, 1);
  yield* bezier2().end(1, 1);

  yield* waitFor(2);
});
