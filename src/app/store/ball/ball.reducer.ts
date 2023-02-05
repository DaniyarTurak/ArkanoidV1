import { createReducer, on } from '@ngrx/store';
import { IBall } from 'src/app/types/ball.interface';
import {
  changeDirection,
  endGame,
  setCoordinates,
  startGame,
} from './ball.actions';

export interface BallState {
  ball: IBall;
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: BallState = {
  ball: { x: 0, y: 0, dx: 1, dy: 1, isMoving: false, diameter: 20 },
  error: '',
  status: 'pending',
};

export const ballReducer = createReducer(
  initialState,
  on(setCoordinates, (state, { x, y }) => {
    return { ...state, ball: { ...state.ball, x, y } };
  }),
  on(startGame, (state) => {
    return { ...state, ball: { ...state.ball, isMoving: true } };
  }),
  on(changeDirection, (state, { dx, dy }) => {
    return { ...state, ball: { ...state.ball, dx, dy } };
  }),
  on(endGame, (state) => {
    return {
      ...state,
      ball: { ...state.ball, x: 0, y: 0, dx: 1, dy: 1, isMoving: false },
    };
  })
);
