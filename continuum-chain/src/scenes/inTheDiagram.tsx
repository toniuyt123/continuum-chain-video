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
  delay,
  Direction,
  easeInOutCubic,
  linear,
  makeRef,
  sequence,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";

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

  yield* all(lattice.animate(1), secondLattice.animate(1));

  const middlePath = createRef<Path>();
  const texts: Latex[] = [];
  view.add(
    <>
      <Path
        ref={middlePath}
        data="M 0 479 Q 100 300 0 200 T -27 105 C 118 117 -146 43 -364 102 C -80 -40 -253 121 -164 53 C -132 43 -125 56 -110 58 C 60 120 -4 59 -107 39 C -150 58 -100 -40 70 32 C 139 14 138 22 326 59 C 368 77 477 -15 281 -30 C -60 20 -80 -40 -16 -45 Q 92 -61 227 -58 Q 299 -86 86 -98 Q -56 -83 -186 -69 Q -428 52 -248 -86 Q -225 -127 -132 -191 Q 0 -220 100 -180 Q 160 -140 120 -200 Q 60 -240 0 -300 T 0 -479"
        stroke="lightseagreen"
        endArrow
        startOffset={35}
        endOffset={35}
        lineWidth={8}
        end={0}
      />
      <Latex
        ref={makeRef(texts, 0)}
        tex={"\\text{Complex and Dense!}"}
        fill={"white"}
        position={[700, 0]}
        fontSize={40}
        opacity={0}
      />
    </>
  );

  yield* all(middlePath().end(1, 5), delay(2, texts[0].opacity(1, 1)));

  yield* waitFor(6);
});
