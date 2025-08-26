import { Latex, makeScene2D, Rect } from "@motion-canvas/2d";
import { makeRef, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const introTexts: Latex[] = [];
  view.add(
    <Rect layout direction={"column"} gap={24} alignItems={"center"}>
      <Latex
        ref={makeRef(introTexts, 0)}
        fill={"white"}
        tex={["\\mathbb{R}", "\\text{ is uncountable?}"]}
        opacity={0}
      />
      <Latex ref={makeRef(introTexts, 1)} fill="white" />
      <Latex ref={makeRef(introTexts, 2)} fill="white" />
    </Rect>
  );
  yield* introTexts[0].opacity(1, 1);
  yield* waitFor(2.5);
  yield* introTexts[1].tex(
    introTexts[1].tex().concat(["\\\\ \\text{Assume that they are countable}"]),
    1
  );
  yield* waitFor(1);
  yield* introTexts[1].tex(
    introTexts[1].tex().concat(["\\implies \\text{contradiction.}"]),
    1
  );
  yield* waitFor(2);
  yield* introTexts[2].tex(
    "\\text{There is a bijection between } \\mathbb{N} \\text{ and } \\mathbb{R}.",
    1.5
  );
  yield* waitFor(2.5);
});
