import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBall } from 'src/app/store/ball/ball.selectors';
import { IBall } from 'src/app/types/ball.interface';

@Component({
  selector: 'mc-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardComponent implements OnInit, OnDestroy {
  ball: IBall;

  constructor(private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.select(selectBall).subscribe((ball) => {
      this.ball = ball;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {}
}
