import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  changeDirection,
  incrementScore,
} from 'src/app/store/ball/ball.actions';
import { selectBall } from 'src/app/store/ball/ball.selectors';
import { destroyBrick } from 'src/app/store/bricks/bricks.actions';
import { IBall } from 'src/app/types/ball.interface';
import { IBrick } from 'src/app/types/bricks.interface';

@Component({
  selector: 'mc-brick',
  templateUrl: './brick.component.html',
  styleUrls: ['./brick.component.scss'],
})
export class BrickComponent implements OnInit {
  @Input() brick: IBrick;
  ball: IBall;
  subscription: Subscription;
  widthBrick: number = 80;
  heightBrick: number = 30;

  constructor(private store: Store, private el: ElementRef) {}

  ngOnInit(): void {
    this.subscription = this.store.select(selectBall).subscribe((ball) => {
      this.ball = ball;
      const { x: brickX, y: brickY } =
        this.el.nativeElement.getBoundingClientRect();

      if (
        this.ball.x >= brickX &&
        this.ball.x <= brickX + this.widthBrick - this.ball.diameter / 2 &&
        this.ball.y >= brickY - this.ball.diameter &&
        this.ball.y <= brickY + this.heightBrick &&
        this.ball.isMoving &&
        this.brick.status
      ) {
        this.destroyBrick();
        this.store.dispatch(
          changeDirection({ dx: this.ball.dx, dy: -this.ball.dy })
        );
      }

      if (
        this.ball.x >= brickX - this.ball.diameter &&
        this.ball.x <= brickX + this.widthBrick &&
        this.ball.y >= brickY - this.ball.diameter / 2 &&
        this.ball.y <= brickY + this.ball.diameter &&
        this.ball.isMoving &&
        this.brick.status
      ) {
        this.destroyBrick();
        this.store.dispatch(
          changeDirection({ dx: -this.ball.dx, dy: this.ball.dy })
        );
      }
    });
  }

  destroyBrick() {
    this.store.dispatch(incrementScore());
    this.store.dispatch(destroyBrick({ id: this.brick.id }));
    this.subscription.unsubscribe();
  }
}
