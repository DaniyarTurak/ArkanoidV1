import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllBricks } from 'src/app/store/bricks/bricks.selectors';
import { IBrick } from 'src/app/types/bricks.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mc-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardComponent implements OnInit, OnDestroy {
  bricks: IBrick[];

  constructor(private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store
      .select(selectAllBricks)
      .pipe(map((bricks) => bricks.filter((b) => b.hitCount === 0)))
      .subscribe((bricks) => {
        this.bricks = bricks;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {}
}
