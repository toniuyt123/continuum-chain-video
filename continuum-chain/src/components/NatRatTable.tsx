import {
  Line,
  LineProps,
  Node,
  Latex,
  initial,
  signal,
  LatexProps,
  NodeProps,
  Rect,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  makeRef,
  Reference,
  sequence,
  Signal,
  SignalValue,
  SimpleSignal,
  useLogger,
  Vector2,
} from "@motion-canvas/core";
import { screenToScene } from "../utils/utils";

export interface NatRatTableProps extends NodeProps {
  widthN?: SignalValue<number>;
  heightN?: SignalValue<number>;
  gap?: SignalValue<number>;
  cellWidth?: SignalValue<number>;
  appeared?: SignalValue<boolean>;
}

export class NatRatTable extends Node {
  public declare readonly numbers: Latex[];
  public declare readonly colHeaders: Latex[];
  public declare readonly rowHeaders: Latex[];
  public declare readonly lines: Line[];
  public declare readonly diagLine: Reference<Line>;
  public declare readonly arrows: Line[];

  public declare readonly innerRect: Reference<Rect>;

  @initial(7)
  @signal()
  public declare readonly widthN: SimpleSignal<number>;

  @initial(5)
  @signal()
  public declare readonly heightN: SimpleSignal<number>;

  @initial(50)
  @signal()
  public declare readonly gap: SimpleSignal<number>;

  @initial(30)
  @signal()
  public declare readonly cellWidth: SimpleSignal<number>;

  @initial(false)
  @signal()
  public declare readonly appeared: SimpleSignal<boolean>;

  public rowColToN(row: number, col: number): number {
    const d = row + col; // diagonal index
    const base = (d * (d + 1)) / 2; // first number in this diagonal

    if (d % 2 === 0) {
      // even diagonal → flip direction
      return base + row;
    } else {
      // odd diagonal → normal direction
      return base + col;
    }
  }

  public nToRowCol(n: number): [number, number] {
    // find which diagonal n is on
    let d = Math.floor((Math.sqrt(8 * n + 1) - 1) / 2);
    let base = (d * (d + 1)) / 2;

    while (base >= n) {
      d--;
      base = (d * (d + 1)) / 2;
    }

    const offset = n - base;

    if (d % 2 === 0) {
      // even diagonal (flipped)
      return [offset, d - offset];
    } else {
      // odd diagonal (normal)
      return [d - offset, offset];
    }
  }

  public rowColToText(row: number, col: number): string {
    if (row === this.heightN() - 1 && col === this.widthN() - 1) {
      return `\\ddots`;
    }
    if (row === this.heightN() - 1) {
      return `\\vdots`;
    }
    if (col === this.widthN() - 1) {
      return "\\dots";
    }
    return `\\frac{${row + 1}}{${col + 1}}`;
  }

  public constructor(props?: NatRatTableProps) {
    super({ ...props });
    this.numbers = [];
    this.colHeaders = [];
    this.rowHeaders = [];
    this.lines = [];
    this.innerRect = createRef<Rect>();
    this.diagLine = createRef<Line>();
    this.arrows = [];

    const elemsOpacity = this.appeared() ? 1 : 0;

    this.add(
      <Rect layout direction={"column"} gap={this.gap() / 2}>
        <Rect layout direction={"row"} gap={this.gap()}>
          <Rect width={this.cellWidth} />
          {Array.from({ length: this.widthN() }).map((_, col) => (
            <Rect
              width={this.cellWidth}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Latex
                ref={makeRef(this.colHeaders, col)}
                tex={`${col + 1}`}
                fill={"white"}
                fontSize={this.cellWidth}
                opacity={elemsOpacity}
              />
            </Rect>
          ))}
        </Rect>
        <Line
          ref={makeRef(this.lines, 0)}
          stroke={"white"}
          lineWidth={4}
          points={[
            [0, 0],
            [
              (this.widthN() + 1) * (this.gap() + this.cellWidth()) -
                this.gap(),
              0,
            ],
          ]}
          end={elemsOpacity}
        />

        <Rect layout direction="row" gap={this.gap()}>
          <Rect layout direction={"column"} gap={this.gap()}>
            {Array.from({ length: this.heightN() }).map((_, row) => (
              <Rect
                width={this.cellWidth}
                height={this.cellWidth() * 2}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Latex
                  ref={makeRef(this.rowHeaders, row)}
                  tex={`${row + 1}`}
                  fill={"white"}
                  fontSize={this.cellWidth}
                  opacity={elemsOpacity}
                />
              </Rect>
            ))}
          </Rect>

          <Rect
            ref={this.innerRect}
            layout
            direction={"column"}
            gap={this.gap()}
          >
            {Array.from({ length: this.heightN() }).map((_, row) => (
              <Rect layout direction={"row"} gap={this.gap()}>
                {Array.from({ length: this.widthN() }).map((_, col) => (
                  <Rect
                    width={this.cellWidth}
                    height={this.cellWidth() * 2}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Latex
                      ref={makeRef(this.numbers, this.rowColToN(row, col))}
                      tex={this.rowColToText(row, col)}
                      fill={"white"}
                      fontSize={this.cellWidth}
                      opacity={elemsOpacity}
                    />
                  </Rect>
                ))}
              </Rect>
            ))}
          </Rect>
        </Rect>
      </Rect>
    );

    //this screen to shit very bad i think but at least just for one arrow

    this.add(
      <Line
        ref={makeRef(this.lines, 1)}
        stroke={"white"}
        lineWidth={4}
        end={elemsOpacity}
        points={[
          () =>
            this.innerRect()
              .topLeft()
              .add(
                new Vector2(-this.gap() / 2, -this.cellWidth() - this.gap() / 2)
              ),
          () =>
            this.innerRect()
              .bottomLeft()
              .add(
                new Vector2(-this.gap() / 2, this.cellWidth() + this.gap() / 2)
              ),
        ]}
      />
    );

    const logger = useLogger();
    let prevPos: Vector2 | null = null;
    for (let i = 0; i < this.numbers.length; i++) {
      let currPos = this.numbers[i]?.absolutePosition();
      if (currPos) {
        currPos = currPos.sub(new Vector2(this.position()));
      }
      if (prevPos && currPos) {
        //   logger.debug(this.position().toString());
        this.add(
          <Line
            ref={makeRef(this.arrows, this.arrows.length)}
            points={[prevPos, currPos]}
            stroke={"lightseagreen"}
            lineWidth={4}
            arrowSize={13}
            endArrow
            startOffset={25}
            endOffset={25}
            end={0}
          />
        );
      }
      prevPos = currPos;
    }
  }

  public *appear() {
    yield* all(
      ...this.lines.map((line) => line.end(1, 1, easeInOutCubic)),
      sequence(0.15, ...this.colHeaders.map((header) => header.opacity(1, 1))),
      sequence(
        0.15,
        ...this.rowHeaders.map((header, i) => header.opacity(1, 1))
      )
    );

    yield* all(
      ...this.innerRect()
        .children()
        .map((row) =>
          sequence(
            0.15,
            ...row.children().map((cell) => cell.children()[0].opacity(1, 1))
          )
        )
    );
  }
}
