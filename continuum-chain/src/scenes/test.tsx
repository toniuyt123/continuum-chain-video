import { Grid, makeScene2D } from "@motion-canvas/2d";
import { all, createRef } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const grid = createRef<Grid>();

  view.add(
    <Grid
      ref={grid}
      width={"100%"}
      height={"100%"}
      stroke={"#666"}
      start={0.5}
      end={0.5}
    />
  );

  yield* all(grid().end(1, 1), grid().start(0, 1));
});
