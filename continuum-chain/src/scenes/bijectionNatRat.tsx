import {
    Circle,
    Latex,
    Layout,
    Line,
    makeScene2D,
    Node,
    Rect,
    View2D,
  } from "@motion-canvas/2d";
import { createSubsetLattice } from "../components/SubsetLattice";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  makeRef,
  range,
  sequence,
  slideTransition,
  useLogger,
  useScene,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { arrApplyGradual } from "../utils/utils";

function screenToScene(screenCoords: Vector2): Vector2 {
  const viewSize = useScene().getSize();
  return new Vector2(
    screenCoords.x - viewSize.x / 2,
    screenCoords.y - viewSize.y / 2
  );
}

function generateRandomNumberString(length: number): string {
  let result = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * digits.length)];
  }
  return result;
}

function addArrow(to: Node, startNode: Node, endNode: Node, ref: any): Node {
  return to.add(<Line
    endArrow
    ref={ref}
    stroke={"lightseagreen"}
    startOffset={50}
    endOffset={50}
    lineWidth={6}
    arrowSize={16}
    end={0}
    points={() => [
      screenToScene(startNode.absolutePosition()),
      screenToScene(endNode.absolutePosition())
    ]}
  />)
}
  
export default makeScene2D(function* (view) {
  const logger = useLogger();
  logger.info("dd");

  
  // Configuration
  const cellWidth = 100;
  const cellHeight = 80;
  const visibleRows = 6; // Number of visible rows
  const visibleCols = 8; // Number of visible columns
  
  const tableRef = createRef<Layout>();
  const cellsText: Latex[] = [];
  const leftNodes: Node[] = [];
  const rightNodes: Node[] = [];
  const arrows: Line[] = [];

  view.add(
    <Layout
      ref={tableRef}
      layout
      direction={'column'}
      gap={50}
      // x={-200} // Adjust position as needed
      // y={-150}
      justifyContent={"center"}
    >
      {/* rows */}
      {range(visibleRows).map(rowIndex => (
        <Layout
          layout
          direction={'row'}
          gap={0}
          // key={`row-${rowIndex}`}
        >
          {/* cols */}
          {range(visibleCols).map(colIndex => (
            <Layout
              width={cellWidth}
              height={cellHeight}
              justifyContent={'center'}
              alignItems={'center'}
              // key={`cell-${rowIndex}-${colIndex}`}
            >
              <Latex
                tex={`\\frac{${rowIndex + 1}}{${colIndex + 1}}`}
                fontSize={32}
                fill={'white'}
                ref={makeRef(cellsText, rowIndex * (visibleCols+1) + colIndex)}
              />
            </Layout>
          ))}
          
          {/* Add dots at the end of each row */}
          <Layout
            width={cellWidth}
            height={cellHeight}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Latex
              tex={'\\cdots'}
              fontSize={40}
              fill={'white'}
              ref={makeRef(cellsText, rowIndex * (visibleCols + 1) + visibleCols)}
            />
          </Layout>
        </Layout>
      ))}
      
      {/* Add a row of dots at the bottom */}
      <Layout
        layout
        direction={'row'}
        gap={0}
      >
        {range(visibleCols).map(colIndex => (
          <Layout
            width={cellWidth}
            height={cellHeight}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Latex
              tex={'\\vdots'}
              fontSize={40}
              fill={'white'}
              ref={makeRef(cellsText, visibleRows * (visibleCols + 1) + colIndex)}
            />
          </Layout>
        ))}
        
        {/* Diagonal dots in the bottom-right corner */}
        <Rect
          // stroke={"white"}
          // lineWidth={3}
          width={cellWidth}
          height={cellHeight}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Latex
            marginTop={-20} // magic value to align diagonal dots with the other dots
            tex={'\\ddots'}
            fontSize={40}
            fill={'white'}
            ref={makeRef(cellsText, visibleRows * (visibleCols+1) + visibleCols)}
          />
        </Rect>
      </Layout>
    </Layout>
  );

  // add arrows
  let arrowIndex = 0;
  for (let diag = 0; diag < visibleRows + visibleCols - 1; diag++) {
    // traverse even diagonals upward
    if (diag % 2 === 0) {
      let r = Math.min(diag, visibleRows - 1);
      let c = diag - r;

      // the transition arrow from previous diagonal
      if (r > 0 && r == diag) {
        const startNode = cellsText[(r-1) * (visibleCols+1) + c]
        const endNode = cellsText[r * (visibleCols+1) + c]
        addArrow(view, startNode, endNode, makeRef(arrows, arrowIndex))
        arrowIndex++
      }

      // arrows from current diagonal
      while (r > 0 && c < visibleCols-1) {
        const startNode = cellsText[r * (visibleCols+1) + c]
        const endNode = cellsText[(r-1) * (visibleCols+1) + c+1]
        addArrow(view, startNode, endNode, makeRef(arrows, arrowIndex))
      //   view.add(<Line
      //     endArrow
      //     ref={makeRef(arrows, arrowIndex)}
      //     stroke={"lightseagreen"}
      //     startOffset={50}
      //     endOffset={50}
      //     lineWidth={6}
      //     arrowSize={16}
      //     end={0}
      //     // TODO: fix below magic numbers
      //     // points={() => [
      //     //   startNode.absolutePosition().addX(-1000).addY(-500),
      //     //   endNode.absolutePosition().addX(-1000).addY(-500)
      //     // ]}
      //     points={() => [
      //       screenToScene(startNode.absolutePosition()),
      //       screenToScene(endNode.absolutePosition())
      //     ]}
      //     // points={() => [startNode.absolutePosition().sub(startNode.parent().parent().position()),
      //     //                 [0,0]]}
      //     // points={() => [[759, 669], [859, 540]]}
      //     // points={() => [[0, 0], [0, 50]]}
      //   />)
      //   // logger.info(startNode.tex().toString())
      //   // logger.info(startNode.absolutePosition().transformAsPoint(view.worldToParent()).toString())
      //   // logger.info(startNode.parent().parent().position().toString())
      //   // logger.info(startNode.width().toString())
      //   // logger.info(startNode.absolutePosition().toString())
      //   // logger.info(startNode.position().toString())
        arrowIndex++;
        r--;
        c++;
      }
    }
    // traverse odd diagonals downward
    else {
      let c = Math.min(diag, visibleCols - 1);
      let r = diag - c;

      // the transition arrow from previous diagonal
      if (c == diag) {
        const startNode = cellsText[r * (visibleCols+1) + c-1]
        const endNode = cellsText[r * (visibleCols+1) + c]
        view.add(<Line
          endArrow
          ref={makeRef(arrows, arrowIndex)}
          stroke={"lightseagreen"}
          startOffset={25}
          endOffset={25}
          lineWidth={6}
          arrowSize={16}
          end={0}
          points={() => [
            screenToScene(startNode.absolutePosition()),
            screenToScene(endNode.absolutePosition())
          ]}
        />)
        // addArrow(view, startNode, endNode, makeRef(arrows, arrowIndex))
        arrowIndex++
      }

      // arrows from current diagonal
      while (c > 0 && r < visibleRows-1) {
        const startNode = cellsText[r * (visibleCols+1) + c]
        const endNode = cellsText[(r+1) * (visibleCols+1) + c-1]
        
        addArrow(view, startNode, endNode, makeRef(arrows, arrowIndex))
        arrowIndex++;
        r++;
        c--;
      }
    }
  }

  cellsText.map(cell => (cell.opacity(0)))
  
  const numbersAnimations = [];

  // setup row by row animation
  for (let c = 0; c < cellsText.length; c++) {
    const cell = cellsText[c];

    // cell.opacity(0);
    // cell.position.x(-400);

    numbersAnimations.push(
      all(
        cell.opacity(1, 0.3, easeInOutCubic),
      )
    );
  }

  // setup simultaneous animations for all rows
  // for (let colIndex = 0; colIndex < visibleCols+1; colIndex++) {
  //   animationss.push(
  //     all(...range(visibleRows+1).map(rowIndex => (
  //       cellsText[rowIndex * (visibleCols+1) + colIndex].opacity(1, 0.3, easeInOutCubic)
  //     ))
  //     )
  //   );
  // }

  // setup simultaneous animation displaying all cells by diagonals
  // for (let colIndex = 0; colIndex < visibleCols+1; colIndex++) {
  //   animationss.push(
  //     all(...range(visibleRows+1).map(rowIndex => (
  //       cellsText[rowIndex * (visibleCols+1) + colIndex].opacity(1, 0.3, easeInOutCubic)
  //     ))
  //     )
  //   );
  // }

  yield* sequence(0.1, ...numbersAnimations);

  yield* waitFor(1);
  
  // TODO: animate arrows
  const arrowsAnimations = [];

  for (let a = 0; a < arrows.length; a++) {
    arrowsAnimations.push(
      all(
        arrows[a].end(1, 0.3, easeInOutCubic)
      )
    )
  }

  yield* sequence(0.1, ...arrowsAnimations);

  yield* waitFor(5);
});
