import { Injectable } from '@angular/core';
import { Subscription, interval, timer, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BallService {
  private _subsciption: Subscription;
  constructor() {}

  //.pipe(takeUntil(timer(3000)))
  startGame(ballMove: Function) {
    this._subsciption = interval(17).subscribe((time) => {
      ballMove();
    });
  }

  stopGame() {
    this._subsciption.unsubscribe();
  }
}
