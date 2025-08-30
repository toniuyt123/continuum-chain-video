import { Latex, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  delay,
  Direction,
  easeInOutCubic,
  makeRef,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";
import { pulseNode } from "../utils/utils";

export default makeScene2D(function* (view) {
  const lattice = createSubsetLattice({
    set: [1, 2, 3],
  });
  view.add(lattice.node);
  lattice.node.position([-500, 250]);
  lattice.node.scale(1.5);

  const texts: Latex[] = [];
  const exampleChains: Latex[] = [];
  view.add(
    <>
      <Latex
        ref={makeRef(texts, 0)}
        tex={"\\text{Chains}"}
        position={[0, -450]}
        fontSize={64}
        opacity={0}
        fill={"white"}
      />
      <Rect
        layout
        direction={"column"}
        position={[300, -100]}
        gap={50}
        alignItems={"center"}
      >
        <Latex
          ref={makeRef(texts, 1)}
          tex={["S_1"]}
          fontSize={48}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 2)}
          tex={["\\text{Where '} \\subset \\text{' is the subset relation}"]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 3)}
          tex={["S_1 \\neq S_2 \\text{ and so on...}"]}
          fontSize={48}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 4)}
          tex={[
            "\\text{So no chains like this: } \\\\ \\{1,2\\} \\subset \\{1,2\\} \\subset \\{1,2\\} \\subset \\dots ",
          ]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 5)}
          tex={["\\text{Length} = \\text{Number of sets in the chain}"]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
      </Rect>

      <Rect layout direction={"column"} position={[300, 300]} gap={20}>
        <Latex
          ref={makeRef(exampleChains, 0)}
          tex={["\\text{Examples:}"]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(exampleChains, 1)}
          tex={[
            "\\emptyset \\subset \\{1\\} \\subset \\{1,2\\} \\subset \\{1,2,3\\}",
          ]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(exampleChains, 2)}
          tex={["\\{1\\} \\subset \\{1,2,3\\}"]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(exampleChains, 3)}
          tex={["\\{2\\} \\subset \\{1,2\\}"]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(exampleChains, 4)}
          tex={["\\{1,2,3\\}"]}
          fontSize={40}
          opacity={0}
          fill={"white"}
        />
      </Rect>
    </>
  );
  yield* waitFor(1);
  yield* all(texts[0].opacity(1, 1), lattice.animate());
  yield* waitFor(1);
  yield* all(texts[1].opacity(1, 1));
  for (let i = 1; i <= 3; i++) {
    yield* texts[1].tex(
      texts[1].tex().concat([`\\subset S_${i + 1}`]),
      0.6,
      easeInOutCubic
    );
  }
  yield* all(
    texts[2].opacity(1, 1),
    texts[1].tex(
      texts[1].tex().concat([`\\dots \\subset S_n`]),
      0.6,
      easeInOutCubic
    )
  );

  yield* waitFor(4.5);
  yield* texts[3].opacity(1, 1);
  yield* waitFor(4);
  yield* texts[4].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[5].opacity(1, 1);

  yield* waitFor(6);

  const chain1 = [
    lattice.latexRefs[0][0],
    lattice.latexRefs[1][0],
    lattice.latexRefs[2][0],
    lattice.latexRefs[3][0],
  ];
  const chain2 = [lattice.latexRefs[1][0], lattice.latexRefs[3][0]];
  const chain3 = [lattice.latexRefs[1][1], lattice.latexRefs[2][0]];
  const chain4 = [lattice.latexRefs[3][0]];

  yield* all(
    exampleChains[0].opacity(1, 1),
    exampleChains[1].opacity(1, 1),
    ...chain1.map((node) => all(node().fill("red", 1), node().scale(1.2, 1)))
  );
  yield* waitFor(0.6);
  yield* all(
    ...chain1.map((node) => all(node().fill("white", 1), node().scale(1, 1)))
  );
  yield* all(
    exampleChains[2].opacity(1, 1),
    ...chain2.map((node) => all(node().fill("red", 1), node().scale(1.2, 1)))
  );
  yield* waitFor(1);
  yield* all(
    ...chain2.map((node) => all(node().fill("white", 1), node().scale(1, 1)))
  );
  yield* all(
    exampleChains[3].opacity(1, 1),
    ...chain3.map((node) => all(node().fill("red", 1), node().scale(1.2, 1)))
  );
  yield* waitFor(1);
  yield* all(
    ...chain3.map((node) => all(node().fill("white", 1), node().scale(1, 1)))
  );
  yield* all(
    exampleChains[4].opacity(1, 1),
    ...chain4.map((node) => all(node().fill("red", 1), node().scale(1.2, 1)))
  );
  yield* waitFor(1);
  yield* all(
    ...chain4.map((node) => all(node().fill("white", 1), node().scale(1, 1)))
  );

  yield* waitFor(6);
});
