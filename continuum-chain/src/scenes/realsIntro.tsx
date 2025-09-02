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

export default makeScene2D(function* (view) {
  const texts: Latex[] = [];
  const arrows: Line[] = [];

  view.add(
    <>
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={[
          "\\text{A set } S \\text{ is \\textbf{countable} if there is a bijection between it and } \\mathbb{N}",
        ]}
        position={[0, -400]}
        fill={"white"}
        fontSize={40}
        opacity={0}
      />
      <Rect layout gap={25} alignItems={"center"} position={[0, -300]}>
        <Latex
          ref={makeRef(texts, texts.length)}
          tex={`S`}
          fill={"white"}
          opacity={0}
        />
        <Line
          ref={makeRef(arrows, arrows.length)}
          points={[
            [0, 0],
            [200, 0],
          ]}
          stroke={"white"}
          lineWidth={4}
          arrowSize={16}
          endArrow
          end={0}
        />
        <Latex
          ref={makeRef(texts, texts.length)}
          tex={`\\mathbb{N}`}
          fill={"white"}
          opacity={0}
        />
      </Rect>
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{Are there any uncountable sets?}"]}
        position={[0, -200]}
        fill={"white"}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\mathbb{N}"]}
        position={[0, -125]}
        fill={"white"}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{The set of real numbers is uncountable - } \\mathbb{R}"]}
        position={[0, -50]}
        fill={"white"}
        opacity={0}
      />
      <Latex
        ref={makeRef(texts, texts.length)}
        tex={["\\text{What is  } \\mathbb{R} ?"]}
        position={[0, 25]}
        fill={"white"}
        opacity={0}
      />
      <Rect layout gap={25} position={[0, 275]} direction={"column"}>
        <Latex
          ref={makeRef(texts, texts.length)}
          tex={`- \\pi?`}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, texts.length)}
          tex={`- \\text{Infinite digits?}`}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, texts.length)}
          tex={`- \\text{Dedekind cuts?}`}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, texts.length)}
          tex={`- \\text{Completion of } \\mathbb{Q}?`}
          fill={"white"}
          opacity={0}
        />
        <Latex
          ref={makeRef(texts, texts.length)}
          tex={`- \\text{???}`}
          fill={"white"}
          opacity={0}
        />
      </Rect>
    </>
  );

  yield* waitFor(1);
  yield* texts[0].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[1].opacity(1, 1);
  yield* arrows[0].end(1, 0.5, easeInOutCubic);
  yield* texts[2].opacity(1, 1);

  yield* waitFor(2);
  yield* texts[3].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[4].opacity(1, 1);
  yield* texts[4].tex(["\\mathbb{N}", ", \\mathbb{Z}"], 1);
  yield* texts[4].tex(["\\mathbb{N}", ", \\mathbb{Z}", ",\\mathbb{Q}"], 1);

  yield* waitFor(3);
  yield* texts[5].opacity(1, 1);
  yield* waitFor(2);
  yield* texts[6].opacity(1, 1);
  yield* waitFor(3);

  for (let i = 7; i < texts.length; i++) {
    yield* texts[i].opacity(1, 0.5);
    yield* waitFor(0.3);
  }

  yield* waitFor(2.5);
});
