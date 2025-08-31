import { Circle, Grid, Latex, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, makeRef, sequence } from "@motion-canvas/core";
import { randomPastelColor } from "../utils/utils";

export default makeScene2D(function* (view) {
  const circles: Circle[] = [];
  for (let i = 3; i >= 0; i--) {
    view.add(
      <>
        <Circle
          ref={makeRef(circles, i)}
          size={150 + i * 200}
          fill={randomPastelColor()}
          stroke={"black"}
          lineWidth={6}
          opacity={0}
        >
          <Latex
            tex={i == 3 ? "\\dots" : `${i + 1}`}
            fill={"black"}
            position={[110 * i, 0]}
          />
        </Circle>
      </>
    );
  }

  yield* sequence(0.7, ...circles.map((circle) => circle.opacity(1, 1)));
});
