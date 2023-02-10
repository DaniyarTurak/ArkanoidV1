import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Board } from 'src/app/constants/Board';
import {
  changeDirection,
  endGame,
  setCoordinates,
  startGame,
} from 'src/app/store/ball/ball.actions';
import { selectBall } from 'src/app/store/ball/ball.selectors';
import { selectAllBricks } from 'src/app/store/bricks/bricks.selectors';
import { selectPaddle } from 'src/app/store/paddle/paddle.selectors';
import { IBall } from 'src/app/types/ball.interface';
import { IPaddle } from 'src/app/types/paddle.interface';

@Component({
  selector: 'mc-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallComponent implements OnInit {
  progressX: number = 0;
  progressY: number = 0;
  ball: IBall;
  paddle: IPaddle;
  bricksLength: number;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(startGame());

    this.store
      .select(selectAllBricks)
      .subscribe(
        (bricks) =>
          (this.bricksLength = bricks.filter(
            (brick) => brick.status === true
          ).length)
      );
    this.store.select(selectBall).subscribe((ball) => (this.ball = ball));
    this.store
      .select(selectPaddle)
      .subscribe((paddle) => (this.paddle = paddle));
  }

  ballMove(): void {
    const currentEl = this.el.nativeElement.querySelector('.ball');
    this.progressX += 3 * this.ball.dx;
    this.progressY += 5.5 * this.ball.dy;
    this.renderer.setStyle(
      currentEl,
      'transform',
      `translate(${this.progressX}px, ${this.progressY}px)`
    );
    const { x: ballX, y: ballY } = currentEl.getBoundingClientRect();
    this.store.dispatch(setCoordinates({ x: ballX, y: ballY }));
    // console.log('Ball: ', this.ball);
    // console.log('Paddle: ', this.paddle);

    if (
      ballY >= Board.HEIGHT + Board.OFFSET - this.ball.diameter ||
      this.ball.score == this.bricksLength
    ) {
      console.log('Game Over');
      this.resetBall(currentEl);
    } else if (this.ball.isMoving) {
      if (
        ballX >= this.paddle.x - this.ball.diameter / 2 &&
        ballX <= this.paddle.x + this.paddle.Width - this.ball.diameter / 2 &&
        ballY >= this.paddle.y - this.ball.diameter &&
        ballY <= this.paddle.y + this.paddle.Height
      ) {
        this.store.dispatch(
          changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
        );
      }

      if (ballY <= Board.OFFSET - this.ball.diameter / 2) {
        this.store.dispatch(
          changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
        );
      } else if (
        ballX <= this.ball.diameter / 2 ||
        ballX >= Board.WIDTH - this.ball.diameter
      ) {
        this.store.dispatch(
          changeDirection({ dx: -this.ball.dx, dy: this.ball.dy })
        );
      }

      requestAnimationFrame(() => this.ballMove());
      //rx => timer
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    if (e.code == 'Enter') {
      this.store.dispatch(startGame());
      this.ballMove();
    } else if (e.code == 'Space') {
      this.store.dispatch(
        changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
      );
    }
  }

  resetBall(currentEl: HTMLElement) {
    this.progressX = 0;
    this.progressY = 0;
    this.renderer.setStyle(currentEl, 'transform', `translate(0px, 0px)`);
    this.store.dispatch(endGame());
  }
}
