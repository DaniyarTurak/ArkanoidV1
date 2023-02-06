import { createReducer, on } from '@ngrx/store';
import { IBall } from 'src/app/types/ball.interface';
import {
  changeDirection,
  endGame,
  incrementScore,
  setCoordinates,
  startGame,
} from './ball.actions';

export interface BallState {
  ball: IBall;
}

export const initialState: BallState = {
  ball: { x: 0, y: 0, dx: 1, dy: 1, isMoving: false, diameter: 15, score: 0 },
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
  on(incrementScore, (state) => {
    return { ...state, ball: { ...state.ball, score: state.ball.score + 1 } };
  }),
  on(endGame, (state) => {
    return {
      ...state,
      ball: {
        ...state.ball,
        x: 0,
        y: 0,
        dx: 1,
        dy: 1,
        isMoving: false,
        score: 0,
      },
    };
  })
);
