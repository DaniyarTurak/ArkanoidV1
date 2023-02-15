import { Injectable } from '@angular/core';
import { IBrick } from '../types/bricks.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBall } from '../types/ball.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class BricksService {
  bricks = [];

  constructor(private http: HttpClient) {}

  getBricks(): Observable<IBrick[]> {
    return this.http.get<IBrick[]>('http://localhost:3000/bricks');
  }

  saveBricks(brick: IBrick): Observable<IBrick[]> {
    console.log('Destroy: ', brick);
    return this.http.put<IBrick[]>(
      'http://localhost:3000/bricks/' + `${brick.id}`,
      brick,
      httpOptions
    );
  }

  setCoordinates(id: number, x: number, y: number, status: boolean): void {
    if (status) this.bricks.push({ id, x, y });
  }
}
