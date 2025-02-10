import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type Alert = {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private _message = new Subject<Alert>();
  message$ = this._message.asObservable();

  constructor() { }

  alert({ message, type }: Alert) {
    this._message.next({ message, type })
  }
}
