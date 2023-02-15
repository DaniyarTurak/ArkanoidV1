import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { of, from } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import { selectAllBricks } from './bricks.selectors';
import {
  destroyBrick,
  loadBricks,
  loadBricksFailure,
  loadBricksSuccess,
} from './bricks.actions';
import { BricksService } from 'src/app/services/bricks.service';

@Injectable()
export class BricksEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private bricksService: BricksService
  ) {}

  loadBricks$ = createEffect(() =>
    this.actions$.pipe(
      //выбираем action
      ofType(loadBricks),
      switchMap(() =>
        from(this.bricksService.getBricks()).pipe(
          map((bricks) => loadBricksSuccess({ bricks: bricks })),
          catchError((error) => of(loadBricksFailure({ error })))
        )
      )
    )
  );

  saveBricks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(destroyBrick),
        //берем новейшую значение
        withLatestFrom(this.store.select(selectAllBricks)),
        switchMap(([action, bricks]) =>
          from(this.bricksService.saveBricks(bricks[action.id]))
        )
      ),
    { dispatch: false }
  );
}
