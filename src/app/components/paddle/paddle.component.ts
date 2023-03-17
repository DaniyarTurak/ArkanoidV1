import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  Renderer2,
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Board } from 'src/app/constants/Board';
import { Paddle } from 'src/app/constants/Paddle';
import { selectBall } from 'src/app/store/ball/ball.selectors';
import { setPaddleCoordinates } from 'src/app/store/paddle/paddle.actions';
import { IBall } from 'src/app/types/ball.interface';

@Component({
  selector: 'mc-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddleComponent implements OnInit {
  Paddle = Paddle;
  ball: IBall;
  difference: number = 0;

  constructor(
    private store: Store,
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.select(selectBall).subscribe((ball) => (this.ball = ball));
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: MouseEvent): void {
    //Before game
    if (
      e.clientX - Paddle.Width / 2 >= 0 &&
      e.clientX - Paddle.Width / 2 <= Board.Width - Paddle.Width &&
      !this.ball.isMoving
    ) {
      const paddle_container =
        this.el.nativeElement.querySelector('.paddle-container');
      const paddle = this.el.nativeElement.querySelector('.paddle');
      const { x, y } = paddle.getBoundingClientRect();
      this.store.dispatch(setPaddleCoordinates({ x, y }));

      this.difference = e.clientX - Paddle.Width / 2;
      this.renderer.setStyle(
        paddle_container,
        'transform',
        `translateX(${e.clientX - Paddle.Width / 2}px)`
      );
      this.cd.detectChanges();
    } //start game
    else if (
      e.clientX - Paddle.Width / 2 >= 0 &&
      e.clientX - Paddle.Width / 2 <= Board.Width - Paddle.Width &&
      this.ball.isMoving
    ) {
      const paddle = this.el.nativeElement.querySelector('.paddle');
      this.renderer.setStyle(
        paddle,
        'transform',
        `translateX(${e.clientX - Paddle.Width / 2 - this.difference}px)`
      );
      const { x, y } = paddle.getBoundingClientRect();
      this.store.dispatch(setPaddleCoordinates({ x, y }));
      this.cd.detectChanges();

      if (e.movementX >= 1) {
        Paddle.direction = 'right';

        if (e.movementX >= 10) {
          Paddle.speedBoost = 2;
        } else {
          Paddle.speedBoost = 0;
        }
      } else if (e.movementX <= -1) {
        Paddle.direction = 'left';

        if (e.movementX <= -10) {
          Paddle.speedBoost = 2;
        } else {
          Paddle.speedBoost = 0;
        }
      }
    }
  }
}
