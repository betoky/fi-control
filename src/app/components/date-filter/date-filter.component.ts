import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Periodicity, RANGE_FORMAT } from '../../models/date';
import { DateFilterService } from '../../services/date/date-filter.service';
import { getDateFormatOf } from '../../utils/date.utility';

type PeriodFilter = {
  label: string;
  value: Periodicity;
}

@Component({
  selector: 'app-date-filter',
  imports: [ButtonModule, CardModule, DatePickerModule, FloatLabelModule, FormsModule, SelectButtonModule],
  templateUrl: './date-filter.component.html'
})
export class DateFilterComponent {
  service = inject(DateFilterService);

  periodOptions: PeriodFilter[] = [
    { label: 'Quotidien', value: 'daily' },
    { label: 'Hebdomadaire', value: 'weekly' },
    { label: 'Mensuel', value: 'monthly' },
    { label: 'Annuel', value: 'yearly' },
  ]

  dpMaxDate = new Date();
  dpSelectionMode = computed(() => this.service.isRangeMode() ? 'range' : 'single');
  dpView = computed(() => this.changeDpView(
    this.service.frequency(), this.service.isRangeMode()
  ));
  dpDateFormat = computed(() => this.service.isRangeMode()
    ? RANGE_FORMAT
    : getDateFormatOf(this.service.frequency()
  ));
  dpValue = computed(() => {
    const [start, end] = this.service.rangeDate()
    return this.service.isRangeMode() ? [start, end] : start;
  });

  onSelect(value: Date | [Date, Date|null]) {
    if (!Array.isArray(value)) {
      this.service.selectDate(value);
      return
    }
    const [a, b] = value;
    b && this.service.selectRange([a, b]);
  }

  private changeDpView(frequency: Periodicity, isRange: boolean) {
    if (isRange) return 'date';
    switch (frequency) {
      case 'yearly':
        return 'year';
      case 'monthly':
        return 'month';
      default:
        return 'date';
    }
  }
}

