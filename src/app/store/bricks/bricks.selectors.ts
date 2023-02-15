import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { BricksState } from './bricks.reducer';

export const selectBricks = (state: AppState) => state.bricks;

export const selectAllBricks = createSelector(
  selectBricks,
  (state: BricksState) => state.bricks
);

export const selectScoreBricks = createSelector(
  selectBricks,
  (state: BricksState) => state.bricks.filter((b) => b.status)
);

// export const selectSingleBrick = (id: number) =>
//   createSelector(selectBricks, (state: BricksState) => state.bricks[id - 1]);
