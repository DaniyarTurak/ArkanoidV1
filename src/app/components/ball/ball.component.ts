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
  incrementScore,
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
import { BallService } from 'src/app/services/ball.service';
import { Brick } from 'src/app/constants/Brick';
import { Ball, StrongBall } from 'src/app/Ball';

@Component({
  selector: 'mc-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallComponent implements OnInit {
  progressX: number = 0;
  progressY: number = 0;
  angleX: number = 3.5;
  angleY: number = 5;
  ball: IBall;
  paddle: IPaddle;
  allBricks: IBrick[];
  bricks = [];
  stopFlag: boolean = false;

  powerfullMode = false;
  speedMode = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store,
    private cd: ChangeDetectorRef,
    private brickService: BricksService,
    private ballService: BallService
  ) {}

  ngOnInit(): void {
    this.store.select(selectBall).subscribe((ball) => (this.ball = ball));
    this.store
      .select(selectPaddle)
      .subscribe((paddle) => (this.paddle = paddle));
  }

  @HostListener('document:keydown', ['$event']) //todo: add Keyboard control
  handleKeyboardEvent(e: KeyboardEvent) {
    if (e.code == 'Enter') {
      this.store.dispatch(startGame());
      this.ballMove();
      this.ballService.startGame(() => this.ballMove());
    } else if (e.code == 'Space') {
      // this.powerfullMode = true;
      // setTimeout(() => {
      //   this.powerfullMode = false;
      // }, 3000);

      this.speedMode = true;
      this.angleX += 5;
      this.angleY += 5;
      setTimeout(() => {
        this.speedMode = false;
        this.angleX -= 5;
        this.angleY -= 5;
      }, 3000);

      // this.store.dispatch(
      //   changeDirection({ dx: -this.ball.dx, dy: -this.ball.dy })
      // );
    }
  }

  ballMove(): void {
    //todo: add bonus drop
    this.bricks = this.brickService.bricks;

    const currentEl = this.el.nativeElement.querySelector('.ball');
    this.progressX += this.angleX * this.ball.dx; // todo: добавить угол
    this.progressY += this.angleY * this.ball.dy;
    this.renderer.setStyle(
      currentEl,
      'transform',
      `translate(${this.progressX}px, ${this.progressY}px)`
    );

    const { x: ballX, y: ballY } = currentEl.getBoundingClientRect();
    this.store.dispatch(setCoordinates({ x: ballX, y: ballY }));

    if (
      ballY >= Board.Height + Board.Offset - this.ball.diameter ||
      !this.ball.isMoving
    ) {
      console.log('Game Over');
      this.resetBall();
    } else {
      this.ballPaddleCollusion();

      if (ballY <= Board.Offset + this.ball.diameter / 2) {
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

      this.ballBricksCollusion(); //todo: после destroy он проходит а не отскачивает
      //requestAnimationFrame(() => this.ballMove());
    }
  }

  resetBall() {
    this.progressX = 0;
    this.progressY = 0;
    this.angleX = 3.5;
    this.angleY = 5;
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.ball'),
      'transform',
      `translate(0px, 0px)`
    );
    this.renderer.setStyle(
      this.el.nativeElement.parentNode.querySelector('.paddle'),
      'transform',
      `translateX(0px)`
    );
    this.store.dispatch(endGame());
    this.ballService.stopGame();
  }

  ballBricksCollusion(): void {
    this.bricks.forEach((b) => {
      if (
        this.ball.x >= b.x - this.ball.diameter &&
        this.ball.x <= b.x + Brick.Width &&
        this.ball.y >= b.y - this.ball.diameter / 2 &&
        this.ball.y <= b.y + Brick.Height - this.ball.diameter / 2 &&
        b.status
      ) {
        if (!this.powerfullMode)
          this.store.dispatch(
            changeDirection({ dx: -this.ball.dx, dy: this.ball.dy })
          );
        //console.log('Connected LeftRight');

        this.store.dispatch(destroyBrick({ id: b.id }));
      } else if (
        this.ball.x >= b.x - this.ball.diameter / 2 &&
        this.ball.x <= b.x + Brick.Width - this.ball.diameter &&
        this.ball.y >= b.y &&
        this.ball.y <= b.y + Brick.Height + this.ball.diameter / 2 &&
        b.status
      ) {
        //console.log('Connected UpDown');
        if (!this.powerfullMode)
          this.store.dispatch(
            changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
          );

        this.store.dispatch(destroyBrick({ id: b.id }));
      }
    });
  }

  ballPaddleCollusion(): void {
    //todo: динамическая управления шариком
    if (
      this.ball.x >= this.paddle.x - this.ball.diameter &&
      this.ball.x <= this.paddle.x + Brick.Width &&
      this.ball.y >= this.paddle.y - this.ball.diameter / 2 &&
      this.ball.y <= this.paddle.y + Brick.Height - this.ball.diameter / 2
    ) {
      this.angleX = 5.5;
      this.store.dispatch(
        changeDirection({ dx: -this.ball.dx, dy: -this.ball.dy })
      );
    } else if (
      this.ball.x >= this.paddle.x - this.ball.diameter / 2 &&
      this.ball.x <= this.paddle.x + Paddle.Width - this.ball.diameter / 2 &&
      this.ball.y >= this.paddle.y - this.ball.diameter / 2
    ) {
      if (this.angleX >= 3.5) {
        this.angleX = 1.5;
      }

      this.store.dispatch(
        changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
      );

      if (Paddle.direction == 'right') {
        if (this.ball.dx < 0) {
          this.store.dispatch(
            changeDirection({ dx: -this.ball.dx, dy: -this.ball.dy })
          );
        }
        this.angleX += Paddle.speedBoost;
        this.angleY += Paddle.speedBoost;
      } else if (Paddle.direction == 'left') {
        if (this.ball.dx > 0) {
          this.store.dispatch(
            changeDirection({ dx: -this.ball.dx, dy: -this.ball.dy })
          );
        }

        this.angleX += Paddle.speedBoost;
        this.angleY += Paddle.speedBoost;
      }
    }
  }
}
