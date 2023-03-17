abstract class BallBase {
  public abstract hitPower(): number;
}

export class Ball extends BallBase {
  public hitPower(): number {
    return 1;
  }
}

abstract class BallOptions extends BallBase {
  decoratedBall: BallBase;

  public abstract override hitPower(): number;
}

export class StrongBall extends BallOptions {
  override decoratedBall: BallBase;

  constructor(ball: BallBase) {
    super();
    this.decoratedBall = ball;
  }

  public hitPower(): number {
    return this.decoratedBall.hitPower() + 1;
  }
}
