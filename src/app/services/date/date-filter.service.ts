import { Injectable, signal } from '@angular/core';
import { Periodicity } from '../../models/date';
import { getRangeOf } from '../../utils/date.utility';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {
  private _currentDate = signal(new Date());
  private _frequency = signal<Periodicity>('weekly');
  private _isRangeMode = signal(false);
  private _rangeDate = signal<[Date, Date]>(getRangeOf(this._frequency(), this._currentDate()));

  currentDate = this._currentDate.asReadonly();
  frequency = this._frequency.asReadonly();
  isRangeMode = this._isRangeMode.asReadonly();
  rangeDate = this._rangeDate.asReadonly();

  selectDate(date: Date) {
    this._currentDate.set(date);
    this._rangeDate.set(getRangeOf(this._frequency(), date));
  }

  selectRange(range: [Date, Date]) {
    const [_, endDate] = getRangeOf('daily', range[1]);
    this._rangeDate.set([range[0], endDate]);
  }

  toggleRangeMode() {
    this._isRangeMode.set(!this._isRangeMode());
  }

  changeFrequency(frequency: Periodicity) {
    this._frequency.set(frequency);
    this._rangeDate.set(getRangeOf(frequency, this._currentDate()));
  }
}
