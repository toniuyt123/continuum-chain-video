import { Latex, makeScene2D, Rect } from "@motion-canvas/2d";
import { all, easeInOutCubic, makeRef, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];
  view.add(
    <Rect layout direction={"column"} gap={75} alignItems={"center"}>
      <Latex
        ref={makeRef(texts, 0)}
        fill={"white"}
        fontSize={64}
        tex={"\\text{What about } 0 \\text{?}"}
        opacity={0}
      />
      <Latex ref={makeRef(texts, 1)} fill={"white"} fontSize={64} />
      <Latex ref={makeRef(texts, 2)} fill={"white"} fontSize={64} />
      <Rect layout gap={100} alignItems={"center"}>
        <Latex ref={makeRef(texts, 3)} fill={"white"} fontSize={90} />
        <Latex ref={makeRef(texts, 4)} fill={"white"} fontSize={64} />
        <Latex ref={makeRef(texts, 5)} fill={"white"} fontSize={90} />
      </Rect>
    </Rect>
  );

  yield* waitFor(1);
  yield* texts[0].opacity(1, 1.5, easeInOutCubic);
  yield* waitFor(0.5);
  yield* texts[1].tex(
    "\\text{Some set with zero elements?}",
    1.5,
    easeInOutCubic
  );
  yield* waitFor(3);
  yield* texts[2].tex("\\text{The empty set}", 1.5, easeInOutCubic);

  yield* waitFor(1);
  yield* texts[3].tex("\\emptyset", 1.5, easeInOutCubic);
  yield* waitFor(0.5);
  yield* all(
    texts[4].tex("\\text{or brackets like this}", 2, easeInOutCubic),
    texts[5].tex("\\{\\}", 2, easeInOutCubic)
  );
  yield* waitFor(1.5);
});
