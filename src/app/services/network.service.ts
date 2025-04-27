// services/network.service.ts
import { Injectable } from '@angular/core';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  online$: Observable<boolean>;
  
  constructor() {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}