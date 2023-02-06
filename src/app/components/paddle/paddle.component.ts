import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  Renderer2,
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/constants/Board';
import { setPaddleCoordinates } from 'src/app/store/paddle/paddle.actions';
import { selectPaddle } from 'src/app/store/paddle/paddle.selectors';
import { IPaddle } from 'src/app/types/paddle.interface';

@Component({
  selector: 'mc-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddleComponent implements OnInit {
  paddle: IPaddle;

  constructor(
    private store: Store,
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectPaddle)
      .subscribe((paddle) => (this.paddle = paddle));
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: MouseEvent): void {
    if (
      e.clientX - this.paddle.Width / 2 >= 0 &&
      e.clientX - this.paddle.Width / 2 <= Board.WIDTH - this.paddle.Width
    ) {
      const paddle = this.el.nativeElement.querySelector('.paddle');
      this.renderer.setStyle(
        paddle,
        'transform',
        `translateX(${e.clientX - this.paddle.Width / 2}px)`
      );
      const { x, y } = paddle.getBoundingClientRect();
      this.store.dispatch(setPaddleCoordinates({ x, y }));
      this.cd.detectChanges();
    }
  }
}
