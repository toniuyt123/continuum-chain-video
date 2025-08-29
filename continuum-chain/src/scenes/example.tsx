import { makeScene2D } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  Direction,
  easeInOutCubic,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const lattice = createSubsetLattice({
    set: [1, 2, 3],
    levelDelay: 1.5,
  });

  // Add the lattice node to the scene
  view.add(lattice.node);
  lattice.node.scale(2);
  lattice.node.position([0, 350]);

  yield* slideTransition(Direction.Bottom, 1);
  // Run its animation
  yield* lattice.animate(1);

  yield* waitFor(2.5);

  yield* lattice.node.opacity(0, 1, easeInOutCubic);

  // for (let levelIndex = 0; levelIndex < lattice.lineRefs.length; levelIndex++) {
  //   const levelLines = lattice.lineRefs[levelIndex];
  //   const line = levelLines[0][0]; // Get the first line of the first subset for this level
  //   yield* line().stroke("red", 0.2, easeInOutCubic);
  // }

  // const secondLattice = createSubsetLattice({
  //   set: [1, 2, 3, 4,],
  //   renderUpToLevel: 2,
  //   verticalGap: -100,
  //   horizontalGap: 150,
  //   startingTex: "\\mathbb{N}",
  //   labelTransform: (label) => `\\mathbb{N} \\setminus ${label}`,
  // });
  const secondLattice = createSubsetLattice({
    set: [1, 2, 3, 4, 5],
    levelDelay: 1.5,
    horizontalGap: [100, 100, 100, 150, 100],
  });
  view.add(secondLattice.node);
  secondLattice.node.scale(1.5);
  secondLattice.node.position([0, 350]);

  yield* secondLattice.animate(1);
  yield* waitFor(0.3);
});
