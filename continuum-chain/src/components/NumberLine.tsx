import {
  Line,
  LineProps,
  Node,
  Latex,
  initial,
  signal,
  LatexProps,
} from "@motion-canvas/2d";
import {
  makeRef,
  Signal,
  SignalValue,
  SimpleSignal,
} from "@motion-canvas/core";

export interface NumberLineProps extends LineProps {
  lineScale?: SignalValue<number>;
  centerOffset?: SignalValue<number>;
}

export class NumberLine extends Line {
  public declare readonly numbers: Node[];

  @initial(100)
  @signal()
  public declare readonly lineScale: SimpleSignal<number>;

  @initial(0)
  @signal()
  public declare readonly centerOffset: SimpleSignal<number>;

  public constructor(props?: NumberLineProps) {
    super({ ...props });
    this.numbers = [];
  }

  public *addNumber(
    value: number,
    latexProps?: Partial<LatexProps>,
    lineProps?: Partial<LineProps> & { lineHeight?: number },
    time?: number,
    offset?: number
  ) {
    latexProps = latexProps ?? {};
    lineProps = lineProps ?? {};
    lineProps.lineHeight = lineProps.lineHeight ?? 20;
    time = time ?? 0.5;
    offset = offset ?? 0;

    this.add(
      <Node ref={makeRef(this.numbers, this.numbers.length)} opacity={0}>
        <Latex
          tex={value.toString()}
          fill={"white"}
          fontSize={48}
          position={() => [
            value * this.lineScale() + this.centerOffset(),
            -50 - offset,
          ]}
          opacity={1}
          {...latexProps}
        />
        <Line
          points={[
            () => [
              value * this.lineScale() + this.centerOffset(),
              -lineProps.lineHeight,
            ],
            () => [
              value * this.lineScale() + this.centerOffset(),
              lineProps.lineHeight,
            ],
          ]}
          stroke={"white"}
          lineWidth={6}
          {...lineProps}
        />
      </Node>
    );
    yield* this.numbers[this.numbers.length - 1].opacity(1, time);
  }

  public *addFraction(numerator: number, denominator: number) {
    const fraction = `\\frac{${numerator}}{${denominator}}`;
    yield* this.addNumber(
      numerator / denominator,
      {
        tex: fraction,
        fontSize: 36,
      },
      {},
      0.5,
      25
    );
  }

  public *populateBetween(
    start: number,
    end: number,
    iterations: number = 4,
    opacityDecay: number = 0.2,
    lineWidthDecay: number = 1,
    lineHeightDecay: number = 3
  ) {
    for (let i = 1; i <= iterations; i++) {
      const step = (end - start) / Math.pow(2, i);
      for (let j = 1; j < Math.pow(2, i); j++) {
        yield* this.addNumber(
          start + j * step,
          {
            opacity: 0,
          },
          {
            opacity: 1 - opacityDecay * i,
            lineWidth: 6 - lineWidthDecay * i,
            lineHeight: 20 - lineHeightDecay * i,
          },
          0.1 - 0.02 * i
        );
      }
    }
  }
}
