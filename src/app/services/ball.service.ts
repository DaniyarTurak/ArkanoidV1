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
    let oneSecond = 1000; //ms
    let frames = 60; //browser frame equals to 60
    this._subsciption = interval(oneSecond / frames).subscribe((time) => {
      ballMove();
    });
  }

  stopGame() {
    this._subsciption.unsubscribe();
  }
}
