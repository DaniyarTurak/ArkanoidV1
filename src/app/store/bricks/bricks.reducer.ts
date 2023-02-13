import { createReducer, on } from '@ngrx/store';
import { IBrick } from 'src/app/types/bricks.interface';
import {
  destroyBrick,
  loadBricks,
  loadBricksFailure,
  loadBricksSuccess,
} from './bricks.actions';

export interface BricksState {
  bricks: IBrick[];
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: BricksState = {
  bricks: [],
  error: '',
  status: 'pending',
};

export const bricksReducer = createReducer(
  initialState,
  on(destroyBrick, (state, { id }) => ({
    ...state,
    bricks: state.bricks.map((b) => {
      if (b.id === id) {
        b = { ...b, hitCount: b.hitCount - 1 };
        if (b.hitCount === 0) {
          return { ...b, status: false };
        }
        return b;
      }
      return b;
    }),
  })),
  on(loadBricks, (state) => ({ ...state, status: 'loading' })),
  on(loadBricksSuccess, (state, { bricks }) => ({
    ...state,
    bricks,
    error: '',
    status: 'success',
  })),
  on(loadBricksFailure, (state, { error }) => ({
    ...state,
    error,
    status: 'error',
  }))
);
