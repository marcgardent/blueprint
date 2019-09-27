import { Injectable, OnDestroy } from '@angular/core';
import {Subject } from 'rxjs'

@Injectable()
export class GameloopService implements OnDestroy {
  public tick = new Subject<number>();
  last : number = Date.now()
  public framerate  = 20;
  private readonly intervalHandle : number;

  constructor() {
    console.info("init")
    this.intervalHandle = setInterval(()=> {
      const now = Date.now();
      const delta = now - this.last;
      this.last = now;
      this.tick.next(delta)
    }, 1000 / this.framerate);
  }

  ngOnDestroy(){
    clearInterval(this.intervalHandle);
  }
}