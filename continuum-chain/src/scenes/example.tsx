import { makeScene2D } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  Direction,
  easeInOutCubic,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const lattice = createSubsetLattice({ set: [1, 2, 3, 4] });

  // Add the lattice node to the scene
  view.add(lattice.node);

  // Run its animation
  yield* lattice.animate(1);

  for (let levelIndex = 0; levelIndex < lattice.lineRefs.length; levelIndex++) {
    const levelLines = lattice.lineRefs[levelIndex];
    const line = levelLines[0][0]; // Get the first line of the first subset for this level
    yield* line().stroke("red", 0.2, easeInOutCubic);
  }

});
