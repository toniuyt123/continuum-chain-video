import { Latex, Line, makeScene2D, Txt } from "@motion-canvas/2d";
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
  const texts: Latex[] = [];

  view.add(
    <>
      <Latex
        ref={makeRef(texts, 0)}
        fill={"white"}
        tex={"\\text{The power set}"}
        fontSize={90}
        position={[0, -400]}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, 1)}
        fill={"white"}
        tex={"\\mathcal{P}(S) \\text{ is the set of all subsets of S.}"}
        fontSize={64}
        opacity={0}
        position={[0, -200]}
      />
      <Latex
        ref={makeRef(texts, 2)}
        fill={"white"}
        tex={["\\mathcal{P}(\\{1,2\\})"]}
        fontSize={64}
        opacity={0}
        position={[0, 0]}
      />
      <Latex
        ref={makeRef(texts, 3)}
        fill={"white"}
        tex={"\\{1, \\{\\{\\dots {\\emptyset}\\dots\\}\\}\\}"}
        fontSize={64}
        opacity={0}
        position={[0, 200]}
      />
    </>
  );

  yield* waitFor(7);

  yield* texts[0].opacity(1, 1.5, easeInOutCubic);
  yield* waitFor(1);
  yield* texts[1].opacity(1, 1.5, easeInOutCubic);
  yield* waitFor(3);
  yield* texts[2].opacity(1, 1.5, easeInOutCubic);
  yield* waitFor(1);
  yield* texts[2].tex(["\\mathcal{P}(\\{1,2\\})", "= \\{"], 1);
  yield* texts[2].tex(["\\mathcal{P}(\\{1,2\\})", "= \\{", "\\emptyset"], 1);
  yield* texts[2].tex(
    ["\\mathcal{P}(\\{1,2\\})", "= \\{", "\\emptyset", ",\\{1\\}"],
    1
  );
  yield* texts[2].tex(
    ["\\mathcal{P}(\\{1,2\\})", "= \\{", "\\emptyset", ",\\{1\\}", ",\\{2\\}"],
    1
  );
  yield* texts[2].tex(
    [
      "\\mathcal{P}(\\{1,2\\})",
      "= \\{",
      "\\emptyset",
      ",\\{1\\}",
      ",\\{2\\}",
      ",\\{1,2\\}\\}",
    ],
    1
  );

  yield* waitFor(7);
  yield* texts[3].opacity(1, 1.5, easeInOutCubic);
  yield* waitFor(3);

  const lattice = createSubsetLattice({
    set: [1, 2],
  });
  view.add(lattice.node);
  lattice.node.position([0, 400]);
  lattice.node.scale(1.5);

  yield* all(
    texts[3].opacity(0, 1.5, easeInOutCubic),
    texts[1].position(texts[1].position().add([0, -50]), 1.5, easeInOutCubic),
    texts[2].position(texts[2].position().add([0, -100]), 1.5, easeInOutCubic),
    delay(1, lattice.animate())
  );

  yield* waitFor(2.5);
  yield* pulseNode(lattice.emptyNode());
  yield* pulseNode(lattice.latexRefs[lattice.latexRefs.length - 1][0]());

  const explainTxt = createRef<Txt>();
  view.add(
    <Txt
      ref={explainTxt}
      text={
        "*{1} and {2} are not subsets of each other but they are both a subset of {1,2}"
      }
      fontFamily={"Katex_Main"}
      fontSize={36}
      position={[400, 300]}
      opacity={0}
      fill={"white"}
      width={500}
      textWrap={true}
      textAlign={"center"}
    />
  );
  yield* waitFor(1);
  yield* explainTxt().opacity(1, 1.5, easeInOutCubic);

  const lineRef = createRef<Line>();
  view.add(
    <Line
      ref={lineRef}
      points={[
        lattice.emptyNode().position().add([0, 350]),
        [-250, 225],
        lattice.nodeRefs[1][0]().position().add([0, 300]),
      ]}
      radius={30}
      endArrow
      end={0}
      arrowSize={16}
      lineWidth={8}
      opacity={0.8}
      stroke={"gray"}
    />
  );
  yield* waitFor(5);
  yield* lineRef().end(1, 1.5, easeInOutCubic);
  yield* waitFor(1.5);
  yield* lineRef().end(0, 1.5, easeInOutCubic);

  yield* waitFor(2);
});
