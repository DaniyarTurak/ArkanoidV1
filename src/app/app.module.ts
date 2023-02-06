import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BricksComponent } from './components/bricks/bricks.component';
import { BricksEffects } from './store/bricks/bricks.effects';
import { bricksReducer } from './store/bricks/bricks.reducer';
import { BrickComponent } from './components/brick/brick.component';
import { BallComponent } from './components/ball/ball.component';
import { ballReducer } from './store/ball/ball.reducer';
import { PaddleComponent } from './components/paddle/paddle.component';
import { paddleReducer } from './store/paddle/paddle.reducer';
import { ScoreBoardComponent } from './components/score-board/score-board.component';

@NgModule({
  declarations: [
    AppComponent,
    BricksComponent,
    BrickComponent,
    BallComponent,
    PaddleComponent,
    ScoreBoardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({
      bricks: bricksReducer,
      ball: ballReducer,
      paddle: paddleReducer,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    EffectsModule.forRoot([BricksEffects]),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
