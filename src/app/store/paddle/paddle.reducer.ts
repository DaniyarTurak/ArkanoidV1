import { createReducer, on } from '@ngrx/store';
import { IPaddle } from 'src/app/types/paddle.interface';
import { setPaddleCoordinates } from './paddle.actions';

export interface PaddleState {
  paddle: IPaddle;
}

export const initialState: PaddleState = {
  paddle: { x: 0, y: 0 },
};

export const paddleReducer = createReducer(
  initialState,
  on(setPaddleCoordinates, (state, { x, y }) => {
    return { ...state, paddle: { ...state.paddle, x, y } };
  })
);
