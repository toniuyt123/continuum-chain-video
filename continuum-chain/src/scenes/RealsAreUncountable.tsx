import { Circle, Latex, makeScene2D, Node, Rect } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
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

function generateRandomNumberString(length: number): string {
  let result = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * digits.length)];
  }
  return result;
}

export default makeScene2D(function* (view) {
  const logger = useLogger();

  const rows = 10;
  const columns = 2;
  const headers = ["\\mathbb{N}", "\\mathbb{R}"];
  const widths = [150, 600];

  const texts: Latex[] = [];
  const dotsRef = createRef<Latex>();
  const finalRealRef = createRef<Latex>();

  const table = (
    <>
      {Array.from({ length: rows + 1 }).map((_, rowIndex) => (
        <Rect layout>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Rect
              stroke={"white"}
              lineWidth={3}
              padding={16}
              width={widths[colIndex]}
              height={75}
              justifyContent="center"
            >
              <Latex
                tex={rowIndex === 0 ? headers[colIndex] : ""}
                opacity={rowIndex === 0 ? 1 : 0}
                fill="white"
                ref={makeRef(texts, rowIndex * columns + colIndex)}
              />
            </Rect>
          ))}
        </Rect>
      ))}
    </>
  );

  view.add(
    <Rect layout direction={"column"}>
      {table}
      <Rect
        ref={dotsRef}
        opacity={0}
        layout
        gap={10}
        justifyContent={"center"}
        alignItems={"center"}
        height={60}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Circle fill="white" size={15} />
        ))}
      </Rect>
      <Rect layout>
        <Rect
          lineWidth={3}
          padding={16}
          width={widths[0]}
          height={75}
          justifyContent="center"
        ></Rect>
        <Rect
          lineWidth={3}
          padding={16}
          width={widths[1]}
          height={75}
          justifyContent="start"
          marginLeft={4}
          ref={finalRealRef}
          opacity={0}
        >
          <Latex fill="red" tex={"0."} />
        </Rect>
      </Rect>
    </Rect>
  );

  const animations = [];

  for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
    const node1 = texts[rowIndex * columns];
    const node2 = texts[rowIndex * columns + 1];
    node1.tex(`${rowIndex - 1}`);
    node2.tex(
      `${generateRandomNumberString(1)}.${generateRandomNumberString(15)}...`
    );

    if (rowIndex === 2) {
      const original = node2.tex()[0];
      const alteredString =
        original.substring(0, 3) + "9" + original.substring(4);
      node2.tex(alteredString);
    }

    animations.push(
      all(
        node1.opacity(1, 0.3, easeInOutCubic),
        node2.opacity(1, 0.3, easeInOutCubic)
      )
    );
  }

  yield* sequence(0.1, ...animations);
  yield* dotsRef().opacity(1, 0.5, easeInOutCubic);

  yield* waitFor(2);

  yield* finalRealRef().opacity(1, 0.5, easeInOutCubic);

  const digitsRef: Latex[] = [];
  const digitsCopy: Latex[] = [];
  for (let i = 1; i <= rows; i++) {
    const realNumNode = texts[i * columns + 1];
    const digit = realNumNode.tex()[0][1 + i];
    const digitPosition = realNumNode.absolutePosition();
    //magic numbers!
    digitPosition.x =
      digitPosition.x + -realNumNode.width() / 2 + 28.7 * (i - 1) + 59;

    view.add(
      <Node>
        <Latex
          ref={makeRef(digitsCopy, i - 1)}
          tex={`${digit}`}
          fill="red"
          opacity={0}
        ></Latex>
        <Latex
          ref={makeRef(digitsRef, i - 1)}
          tex={[`${digit}`]}
          fill="red"
          opacity={0}
        ></Latex>
      </Node>
    );

    digitsRef[i - 1].absolutePosition(digitPosition);
    digitsCopy[i - 1].absolutePosition(digitPosition);
  }

  const processDigit = function* (
    index: number,
    delayBeforeDrop: number = 0.5,
    skipAddOne: boolean = false
  ) {
    yield* all(
      digitsRef[index].opacity(1, 0.5, easeInOutCubic),
      digitsCopy[index].opacity(1, 0.5, easeInOutCubic)
    );
    yield* waitFor(delayBeforeDrop);

    yield* digitsRef[index].absolutePosition(
      new Vector2(
        finalRealRef().absolutePosition().x -
          finalRealRef().width() / 2 +
          75 +
          index * 30,
        finalRealRef().absolutePosition().y - 2
      ),
      1.5,
      easeInOutCubic
    );

    const addOne = createRef<Latex>();
    if (!skipAddOne) {
      view.add(<Latex ref={addOne} tex={"^{+1}"} fill="red" opacity={0} />);
      addOne().left(digitsRef[index].right());
      yield* addOne().opacity(1, 0.3);
    }

    const digit: number = +digitsRef[index].tex()[0];
    yield* all(
      digitsRef[index].tex(`${(digit + 1) % 10}`, 0.5, easeInOutCubic),
      ...(skipAddOne
        ? []
        : [
            addOne().opacity(0, 0.5, easeInOutCubic),
            addOne().position(digitsRef[index].position(), 0.5, easeInOutCubic),
          ])
    );
  };
  yield* processDigit(0);
  yield* waitFor(3);
  yield* processDigit(1);
  yield* waitFor(1);

  //process the rest in sequence
  yield* sequence(
    0.3,
    ...Array.from({ length: rows - 2 }, (_, i) =>
      processDigit(i + 2, i === rows - 3 ? 0.5 : 0.3, true)
    )
  );
});
