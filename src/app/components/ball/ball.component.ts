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
import { Paddle } from 'src/app/constants/Paddle';
import { BricksService } from 'src/app/services/bricks.service';
import { destroyBrick } from 'src/app/store/bricks/bricks.actions';
import { IBrick } from 'src/app/types/bricks.interface';

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
  allBricks: IBrick[];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store,
    private cd: ChangeDetectorRef,
    private brickService: BricksService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(startGame());

    this.store
      .select(selectAllBricks)
      .subscribe((bricks) => (this.allBricks = bricks));
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
      ballY >=
      Board.Height + Board.Offset - this.ball.diameter //||  this.ball.score == this.bricksLength
    ) {
      console.log('Game Over');
      this.resetBall(currentEl);
    } else if (this.ball.isMoving) {
      if (
        ballX >= this.paddle.x - this.ball.diameter / 2 &&
        ballX <= this.paddle.x + Paddle.Width - this.ball.diameter / 2 &&
        ballY >= this.paddle.y - this.ball.diameter &&
        ballY <= this.paddle.y + Paddle.Height
      ) {
        this.store.dispatch(
          changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
        );
      }

      if (ballY <= Board.Offset - this.ball.diameter / 2) {
        this.store.dispatch(
          changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
        );
      } else if (
        ballX <= this.ball.diameter / 2 ||
        ballX >= Board.Width - this.ball.diameter
      ) {
        this.store.dispatch(
          changeDirection({ dx: -this.ball.dx, dy: this.ball.dy })
        );
      }

      const bricks = this.brickService.bricks;
      this.allBricks.forEach((b) => {
        if (
          this.ball.x >= bricks[b.id].x &&
          this.ball.x <=
            bricks[b.id].x + bricks[b.id].width - this.ball.diameter / 2 &&
          this.ball.y >= bricks[b.id].y - this.ball.diameter &&
          this.ball.y <= bricks[b.id].y + bricks[b.id].height &&
          this.ball.isMoving &&
          b.status
        ) {
          console.log('Vertical: ', b.id, b.hitCount);
          this.store.dispatch(
            changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
          );
          this.store.dispatch(destroyBrick({ id: b.id }));
        }

        if (
          this.ball.x >= bricks[b.id].x - this.ball.diameter &&
          this.ball.x <= bricks[b.id].x + bricks[b.id].width &&
          this.ball.y >= bricks[b.id].y - this.ball.diameter / 2 &&
          this.ball.y <= bricks[b.id].y + this.ball.diameter &&
          this.ball.isMoving &&
          b.status
        ) {
          console.log('Horizontal: ', b.id, b.hitCount);
          this.store.dispatch(
            changeDirection({ dx: -this.ball.dx, dy: this.ball.dy })
          );
          this.store.dispatch(destroyBrick({ id: b.id }));
        }
      });

      requestAnimationFrame(() => this.ballMove());
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
