import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { loadBricks } from 'src/app/store/bricks/bricks.actions';
import { selectAllBricks } from 'src/app/store/bricks/bricks.selectors';
import { IBrick } from 'src/app/types/bricks.interface';

@Component({
  selector: 'mc-bricks',
  templateUrl: './bricks.component.html',
  styleUrls: ['./bricks.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BricksComponent implements OnInit {
  allBricks$ = [];

  constructor(private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.dispatch(loadBricks());

    this.store.select(selectAllBricks).subscribe((bricks) => {
      this.allBricks$ = bricks;
    });
  }

  // .subscribe((bricks) => {
  //   this.allBricks = bricks;
  //   this.cd.detectChanges();
  // });
}
