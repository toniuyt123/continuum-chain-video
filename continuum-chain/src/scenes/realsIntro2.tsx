import {
  Grid,
  Latex,
  Line,
  makeScene2D,
  QuadBezier,
  Rect,
  Video,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  makeRef,
  sequence,
  slideTransition,
  useLogger,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import video from "../../../3d-stuff/video_output/confusedSHepherd.mp4";
import { NumberLine } from "../components/NumberLine";
import { ListOfNumbers } from "../components/ListOfNumbers";
import { randomInt } from "../utils/utils";

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];
  const arrows: Line[] = [];
  const len = 79;
  const listOfNumsRef = createRef<ListOfNumbers>();
  const realNum = ["0."].concat(
    Array.from({ length: len }, (_, i) => randomInt(0, 9).toString())
  );
  const pi = ["3."].concat(
    "14159265358979323846264338327950288419716939937510582097494459230781640628620".split(
      ""
    )
  );
  const sqrt2 = ["1."].concat(
    "4142135623730950488016887242096980785696718753769480731766797379907324784621".split(
      ""
    )
  );
  const oneThird = ["0."].concat(Array.from({ length: len }, (_, i) => "3"));

  const realLabels: Latex[] = [];
  const reals: ListOfNumbers[] = [];

  view.add(
    <>
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\mathbb{R}"]}
        position={[0, -400]}
        fill={"white"}
        opacity={0}
      />
      <Rect layout gap={75} position={[700, -150]} direction={"column"}>
        <ListOfNumbers ref={listOfNumsRef} numbers={realNum} gap={0} />
        <Rect layout opacity={1} alignItems={"center"}>
          <Latex
            ref={makeRef(realLabels, 0)}
            tex={"\\pi \\ \\ \\ = \\ "}
            fill={"white"}
            opacity={0}
          />

          <ListOfNumbers ref={makeRef(reals, 0)} numbers={pi} gap={0} />
        </Rect>
        <Rect layout opacity={1} alignItems={"center"}>
          <Latex
            ref={makeRef(realLabels, 1)}
            tex={"\\sqrt{2} = \\"}
            fill={"white"}
            opacity={0}
          />

          <ListOfNumbers ref={makeRef(reals, 1)} numbers={sqrt2} gap={0} />
        </Rect>
      </Rect>
      <Latex
        ref={makeRef(texts, 1)}
        tex={"\\text{No pattern in the digits!}"}
        fill={"white"}
        position={[0, 100]}
        opacity={0}
      />
      <Rect layout opacity={1} alignItems={"center"} position={[730, 300]}>
        <Latex
          ref={makeRef(realLabels, 2)}
          tex={"\\frac{1}{3} = \\"}
          fill={"white"}
          opacity={0}
        />

        <ListOfNumbers ref={makeRef(reals, 2)} numbers={oneThird} gap={0} />
      </Rect>
    </>
  );

  yield* slideTransition(Direction.Right, 1);
  yield* waitFor(1);
  yield* texts[0].opacity(1, 1);
  yield* texts[0].tex(["\\mathbb{R}", "= \\mathbb{Q}"], 1);
  yield* waitFor(1);

  yield* texts[0].tex(
    ["\\mathbb{R}", "= \\mathbb{Q}", "+ \\text{ irrationals}"],
    1
  );

  yield* waitFor(2);
  yield* listOfNumsRef().renderSome(1);
  yield* listOfNumsRef().renderSome(70);

  yield* waitFor(2);
  yield* all(realLabels[0].opacity(1, 1), reals[0].renderSome(70));
  yield* all(realLabels[1].opacity(1, 1), reals[1].renderSome(70));

  yield* waitFor(1);
  yield* texts[1].opacity(1, 1);
  yield* waitFor(1.5);
  yield* realLabels[2].opacity(1, 1);
  yield* reals[2].renderSome(70);

  yield* waitFor(4);
});
