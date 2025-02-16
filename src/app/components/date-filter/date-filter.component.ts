import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { DatePickerModule, DatePickerTypeView } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Periodicity } from '../../models/date';
import { getRangeOf } from '../../utils/date.utility';

type PeriodFilter = {
  label: string;
  value: Periodicity;
}

@Component({
  selector: 'app-date-filter',
  imports: [ButtonModule, CardModule, DatePickerModule, FloatLabelModule, FormsModule, SelectButtonModule],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss'
})
export class DateFilterComponent implements OnInit {
  periodOptions: PeriodFilter[] = [
    { label: 'Quotidien', value: 'daily' },
    { label: 'Hebdomadaire', value: 'weekly' },
    { label: 'Mensuel', value: 'monthly' },
    { label: 'Annuel', value: 'yearly' },
  ]
  private readonly DAILY_FORMAT = 'DD d MM yy';
  private readonly WEEKLY_FORMAT = 'MM yy';
  private readonly MONTHLY_FORMAT = 'MM yy';
  private readonly YEARLY_FORMAT = 'yy';
  private readonly RANGE_FORMAT = 'dd/mm/yy';

  @Input() frequency: Periodicity = 'weekly';
  @Input() simpleDate?: Date;
  @Input() rangeDate?: [Date, Date];
  @Output() changeSimple = new EventEmitter<Date>();
  @Output() changeRange = new EventEmitter<[Date, Date]>();
  @Output() changeFrequency = new EventEmitter<Periodicity>();
  @Output() changeMode = new EventEmitter<boolean>();

  displayDate?: Date | [Date, Date | null];
  range?: [Date, Date];
  datePickerHasChange = false;

  // Display date options
  @Input() isRangeMode = false;
  dateView: DatePickerTypeView = 'date';
  dateFormat = this.DAILY_FORMAT;
  maxDate = new Date();

  ngOnInit() {
    if (this.simpleDate && !this.isRangeMode) {
      this.displayDate = this.simpleDate;
      this.updateSingleView(this.frequency, this.displayDate);
    }
    if (this.isRangeMode && this.rangeDate) {
      const [start, end] = this.rangeDate;
      this.dateView = 'date';
      this.dateFormat = this.RANGE_FORMAT;
      this.displayDate = [new Date(start), new Date(end)];
    }
  }

  onFrequencyChange() {
    if (this.displayDate && !Array.isArray(this.displayDate)) {
      const range = this.updateSingleView(this.frequency, this.displayDate);
      this.changeRange.next(range);
      this.changeFrequency.next(this.frequency);
    }
  }

  private updateSingleView(frequency: Periodicity, displayDate: Date) {
    this.updateDateView(frequency);
    this.displayDate = new Date(displayDate);
    this.range = getRangeOf(frequency, displayDate);
    return this.range;
  }

  onCloseDatePicker() {
    if (this.displayDate && this.datePickerHasChange) {
      if (!Array.isArray(this.displayDate)) {
        this.range = getRangeOf(this.frequency, this.displayDate);
        this.changeSimple.next(this.displayDate);
        this.changeRange.next(this.range);
      } else {
        let [start, end] = this.displayDate;
        if (!end) {
          [start, end] = getRangeOf('daily', start);
        }
        this.changeRange.next([start, end]);
      }
    }
  }

  onSwitchMode() {
    this.isRangeMode = !this.isRangeMode;
    if (this.isRangeMode) {
      this.dateView = 'date';
      this.dateFormat = this.RANGE_FORMAT;
      this.displayDate = [new Date(this.displayDate as Date), null];
    } else {
      this.updateDateView(this.frequency);
      const [start] = this.displayDate as [Date, Date];
      this.displayDate = new Date(start);
    }
    this.changeMode.next(this.isRangeMode);
  }

  private updateDateView(frequency: string | null) {
    switch (frequency) {
      case 'yearly':
        this.dateView = 'year';
        this.dateFormat = this.YEARLY_FORMAT;
        break;
      case 'monthly':
        this.dateView = 'month';
        this.dateFormat = this.MONTHLY_FORMAT;
        break;
      case 'weekly':
        this.dateView = 'date';
        this.dateFormat = this.WEEKLY_FORMAT;
        break;
      default:
        this.dateView = 'date';
        this.dateFormat = this.DAILY_FORMAT;
        break;
    }
  }
}

