import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BricksService } from 'src/app/services/bricks.service';
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

  constructor(private el: ElementRef, private brickService: BricksService) {}

  ngOnInit(): void {
    const { x: brickX, y: brickY } =
      this.el.nativeElement.getBoundingClientRect();
    this.brickService.setCoordinates(
      this.brick.id,
      brickX,
      brickY,
      this.widthBrick,
      this.heightBrick
    );
  }
}
