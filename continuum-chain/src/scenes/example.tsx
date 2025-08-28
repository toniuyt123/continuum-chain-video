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
    set: [1, 2, 3, 4],
    renderUpToLevel: 2,
  });

  // Add the lattice node to the scene
  view.add(lattice.node);

  // Run its animation
  yield* lattice.animate(1);

  for (let levelIndex = 0; levelIndex < lattice.lineRefs.length; levelIndex++) {
    const levelLines = lattice.lineRefs[levelIndex];
    const line = levelLines[0][0]; // Get the first line of the first subset for this level
    yield* line().stroke("red", 0.2, easeInOutCubic);
  }

  const secondLattice = createSubsetLattice({
    set: [1, 2, 3, 4],
    renderUpToLevel: 2,
    verticalGap: -100,
    horizontalGap: 150,
    startingTex: "\\mathbb{N}",
    labelTransform: (label) => `\\mathbb{N} \\setminus ${label}`,
  });
  view.add(secondLattice.node);

  yield* secondLattice.animate(1);
});
