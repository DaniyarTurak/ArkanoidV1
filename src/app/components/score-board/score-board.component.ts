import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAllBricks,
  selectScoreBricks,
} from 'src/app/store/bricks/bricks.selectors';
import { IBrick } from 'src/app/types/bricks.interface';
import { map } from 'rxjs/operators';
import { BricksService } from 'src/app/services/bricks.service';
import { Subscription } from 'rxjs';
import { endGame } from 'src/app/store/ball/ball.actions';

@Component({
  selector: 'mc-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardComponent implements OnInit, OnDestroy {
  score: number = 0;
  allBricksCount: number = 0;
  _subscription: Subscription;
  prevBricks = [];

  constructor(private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.select(selectScoreBricks).subscribe((bricks) => {
      //console.log('score: ', this.score);
      if (this.prevBricks.length !== 0) {
        this.score = Math.abs(bricks.length - this.prevBricks.length);
        if (bricks.length == 0) {
          this.store.dispatch(endGame());
        }
      }
      this.prevBricks = [...bricks];

      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {}
}
