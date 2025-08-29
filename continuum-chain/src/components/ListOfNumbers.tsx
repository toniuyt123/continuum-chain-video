import {
  initial,
  Latex,
  Node,
  NodeProps,
  Rect,
  signal,
} from "@motion-canvas/2d";
import {
  all,
  createEffect,
  delay,
  easeInOutCubic,
  easeOutCubic,
  easeOutQuint,
  Logger,
  makeRef,
  Signal,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  tween,
  useLogger,
} from "@motion-canvas/core";

export interface ListOfNumbersProps extends NodeProps {
  numbers: number[];
  intialRendered?: SignalValue<number>;
  gap?: SignalValue<number>;
}

export class ListOfNumbers extends Node {
  public declare readonly numbers: number[];

  @initial(0)
  @signal()
  public declare readonly initialRendered: SimpleSignal<number>;

  @initial(50)
  @signal()
  public declare readonly gap: SimpleSignal<number>;

  public latexNums: Latex[] = [];
  private renderedUpTo: number = 0;

  public constructor(props?: ListOfNumbersProps) {
    super({ ...props });
    this.numbers = props.numbers;
    this.renderedUpTo = this.initialRendered();

    this.add(
      <Rect layout gap={this.gap}>
        {this.numbers.map((num, i) => (
          <Rect width={64}>
            <Latex
              fill="white"
              tex={num.toString()}
              ref={makeRef(this.latexNums, i)}
              opacity={i >= this.initialRendered() ? 0 : 1}
            />
          </Rect>
        ))}
      </Rect>
    );
  }

  public *renderSome(n: number, duration: number = 2) {
    const targetCount = Math.min(this.renderedUpTo + n, this.numbers.length);

    yield* all(
      ...this.latexNums
        .slice(this.renderedUpTo, targetCount)
        .map((latex, i) => delay(easeOutQuint(i / n), latex.opacity(1, 1)))
    );
  }

  public *applyAnimated(
    f: (t: Latex) => ThreadGenerator | Callback,
    start: number = 0
  ) {
    const n = this.latexNums.length - start;

    yield* all(
      ...this.latexNums
        .slice(start, this.latexNums.length)
        .map((latex, i) => delay(easeOutQuint(i / n), f(latex)))
    );
  }
}
