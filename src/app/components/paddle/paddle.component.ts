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
import { setPaddleCoordinates } from 'src/app/store/paddle/paddle.actions';

@Component({
  selector: 'mc-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddleComponent implements OnInit {
  Paddle = Paddle;
  constructor(
    private store: Store,
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: MouseEvent): void {
    if (
      e.clientX - Paddle.Width / 2 >= 0 &&
      e.clientX - Paddle.Width / 2 <= Board.Width - Paddle.Width
    ) {
      const paddle = this.el.nativeElement.querySelector('.paddle');
      this.renderer.setStyle(
        paddle,
        'transform',
        `translateX(${e.clientX - Paddle.Width / 2}px)`
      );
      const { x, y } = paddle.getBoundingClientRect();
      this.store.dispatch(setPaddleCoordinates({ x, y }));
      this.cd.detectChanges();
    }
  }
}
