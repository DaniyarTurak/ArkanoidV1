import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Brick } from 'src/app/constants/Brick';
import { BricksService } from 'src/app/services/bricks.service';
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
  Brick = Brick;

  constructor(private el: ElementRef, private brickService: BricksService) {}

  ngOnInit(): void {
    const { x: brickX, y: brickY } =
      this.el.nativeElement.getBoundingClientRect();

    this.brickService.setCoordinates(
      this.brick.id,
      brickX,
      brickY,
      this.brick.status,
      this.brick.hitCount
    );
  }
}
