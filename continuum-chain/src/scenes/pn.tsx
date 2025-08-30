import { Latex, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  delay,
  Direction,
  easeInOutCubic,
  makeRef,
  sequence,
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

  const headingText = createRef<Latex>();
  const texts: Latex[] = [];
  const exampleChains: Latex[] = [];
  view.add(
    <>
      <Latex
        ref={headingText}
        tex={"\\text{Power Set on Infinite Sets}"}
        position={[0, -450]}
        fontSize={64}
        opacity={0}
        fill={"white"}
      />
      <Rect
        layout
        direction={"column"}
        gap={50}
        alignItems={"center"}
        position={[0, 50]}
      >
        <Latex
          ref={makeRef(texts, 0)}
          tex={["|\\mathcal{P}(\\{1,2, 3\\})| > |{1,2,3}| ?"]}
          fontSize={64}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 1)}
          tex={
            "|\\{\\{\\},\\{1\\},\\{2\\},\\{3\\},\\{1,2\\},\\{2,3\\},\\{3,1\\},\\{1,2,3\\}\\}| > |\\{1,2,3\\}|"
          }
          fontSize={52}
          textWrap={true}
          textAlign={"center"}
          fontFamily={"Kanex_main"}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 2)}
          tex={["8 > 3"]}
          fontSize={64}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 3)}
          fontSize={64}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 4)}
          fontSize={64}
          opacity={0}
          fill={"white"}
        />
        <Latex
          ref={makeRef(texts, 5)}
          fontSize={64}
          opacity={0}
          fill={"white"}
        />
      </Rect>
    </>
  );
  yield* waitFor(4);
  yield* sequence(1.5, ...texts.slice(0, 3).map((text) => text.opacity(1, 1)));
  yield* waitFor(3);
  yield* all(
    headingText().opacity(1, 1),
    ...texts.map((text) => text.opacity(0, 1))
  );

  yield* waitFor(2);
  texts[0].tex("\\mathcal{P}(\\mathbb{N})");

  texts[1].tex(
    "\\text{Finite subsets: }\\{1,2,3\\}, \\{10,20,\\dots,1000\\}, \\{100,\\dots,10^{10}\\},..."
  );
  texts[2].tex("\\{2,4,8,...\\}");
  texts[3].tex("\\{1,3,5,\\dots\\}");
  texts[4].tex("\\{2,3,5,7\\dots\\}");
  texts[5].tex("\\vdots");

  yield* texts[0].opacity(1, 1);
  yield* waitFor(3);

  yield* texts[1].opacity(1, 1);
  yield* waitFor(4);

  yield* texts[2].opacity(1, 1);
  yield* texts[3].opacity(1, 1);
  yield* texts[4].opacity(1, 1);
  yield* texts[5].opacity(1, 1);

  yield* waitFor(1);

  yield* all(...texts.map((text) => text.opacity(0, 1)));

  texts.map((text) => text.tex(""));

  texts[0].tex("|\\mathcal{P}(\\mathbb{N})| > |\\mathbb{N}|");
  texts[1].fontSize(64);
  texts[1].tex("\\text{So if } \\mathbb{N} \\text{ is countable,}");
  texts[2].tex(
    "\\text{then }\\mathcal{P}(\\mathbb{N}) \\text{ should be uncountable.}"
  );

  yield* texts[0].opacity(1, 1);
  yield* waitFor(5);
  yield* texts[1].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[2].opacity(1, 1);

  yield* waitFor(12);
});
