import { Node, Latex, Line } from "@motion-canvas/2d";
import {
  Vector2,
  createRef,
  all,
  easeInOutCubic,
  waitFor,
} from "@motion-canvas/core";

export interface SubsetLatticeOptions {
  set: number[];
  levelDelay?: number;
  renderUpToLevel?: number;
  verticalGap?: number;
  horizontalGap?: number | number[];
  startingTex?: string;
  labelTransform?: (label: string) => string;
}

// this is very badly made for a motion canvas thing. It should be signals but it was my first thing so yeah

export function createSubsetLattice({
  set,
  levelDelay = 0.5,
  renderUpToLevel,
  verticalGap = 100,
  horizontalGap = 100,
  startingTex = "\\emptyset",
  labelTransform = (label) => label,
}: SubsetLatticeOptions) {
  const root = createRef<Node>();
  // Store refs
  const nodeRefs: Array<Array<ReturnType<typeof createRef<Node>>>> = [];
  const latexRefs: Array<Array<ReturnType<typeof createRef<Latex>>>> = [];
  const lineRefs: Array<Array<Array<ReturnType<typeof createRef<Line>>>>> = [];
  renderUpToLevel = renderUpToLevel ?? set.length;

  // We’ll collect everything inside root
  const rootNode = <Node ref={root} />;
  const emptyNode = createRef<Node>();
  const emptyLatex = createRef<Latex>();

  const horizontalGaps: number[] = [];
  if (typeof horizontalGap === "number") {
    for (let i = 0; i < set.length; i++) {
      horizontalGaps.push(horizontalGap);
    }
  } else {
    horizontalGaps.push(...horizontalGap);
  }

  // This generator performs the animation when called
  function* animate(levelsToAnimate = set.length) {
    // Empty set node

    root().add(
      <Node ref={emptyNode} position={new Vector2(0, 0)}>
        <Latex ref={emptyLatex} tex={startingTex} fill="white" />
      </Node>
    );

    // Generate all non-empty subsets
    function getSubsets<T>(array: T[]): T[][] {
      const result: T[][] = [];
      const n = array.length;
      for (let i = 1; i < 1 << n; i++) {
        const subset: T[] = [];
        for (let j = 0; j < n; j++) {
          if (i & (1 << j)) subset.push(array[j]);
        }
        result.push(subset);
      }
      return result;
    }

    const subsets = getSubsets(set);
    const levels: number[][][] = [];
    for (let k = 1; k <= set.length; k++) {
      levels.push(subsets.filter((s) => s.length === k));
    }

    let prevNodes: ReturnType<typeof createRef<Node>>[] = [emptyNode];

    for (
      let level = 0;
      level < Math.min(levels.length, renderUpToLevel);
      level++
    ) {
      const currLevel = levels[level];
      const currPositions: Vector2[] = currLevel.map(
        (_, i) =>
          new Vector2(
            (-(currLevel.length - 1) * horizontalGaps[level]) / 2 +
              i * horizontalGaps[level],
            -verticalGap * (level + 1)
          )
      );

      nodeRefs[level] = currLevel.map(() => createRef<Node>());
      latexRefs[level] = currLevel.map(() => createRef<Latex>());
      lineRefs[level] = currLevel.map(
        (): Array<ReturnType<typeof createRef<Line>>> => []
      );

      currLevel.forEach((subset, i) => {
        const labelOffset = verticalGap < 0 ? 20 : -20;

        root().add(
          <Node ref={nodeRefs[level][i]} position={currPositions[i]}>
            <Latex
              ref={latexRefs[level][i]}
              tex={labelTransform(`\\{${subset.join(",")}\\}`)}
              y={labelOffset}
              fill="white"
              fontSize={24}
              opacity={0}
            />
          </Node>
        );

        // Find immediate parents
        const parents =
          level === 0
            ? [[]]
            : subset.map((_, j) =>
                subset.slice(0, j).concat(subset.slice(j + 1))
              );

        parents.reverse().forEach((parent) => {
          const parentIdx =
            level === 0
              ? 0
              : levels[level - 1].findIndex(
                  (s) =>
                    s.length === parent.length &&
                    s.every((v, idx) => v === parent[idx])
                );

          if (parentIdx >= 0) {
            const startNode = level === 0 ? emptyNode : prevNodes[parentIdx];
            const lineStart = new Vector2(
              startNode().position().x,
              startNode().position().y + labelOffset * 2
            );

            const lineRef = createRef<Line>();
            lineRefs[level][i].push(lineRef);

            root().add(
              <Line
                ref={lineRef}
                points={[lineStart, lineStart]} // collapsed initially
                endArrow
                arrowSize={8}
                lineWidth={4}
                stroke="darkgray"
                opacity={0.7}
              />
            );
          }
        });
      });

      // Animate lines + node labels
      yield* all(
        ...currLevel.map((_, i) =>
          all(
            ...lineRefs[level][i].map((lineRef) =>
              lineRef().points(
                [lineRef().points()[0], nodeRefs[level][i]().position()],
                levelDelay,
                easeInOutCubic
              )
            ),
            latexRefs[level][i]().opacity(1, levelDelay, easeInOutCubic)
          )
        )
      );

      prevNodes = nodeRefs[level];
    }
  }

  return {
    node: rootNode,
    animate,
    nodeRefs,
    latexRefs,
    lineRefs,
    emptyNode,
    emptyLatex,
  }; // Return refs for testing
}
