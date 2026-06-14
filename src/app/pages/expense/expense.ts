import { Component, effect, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Drawer } from 'primeng/drawer';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../services/alert/alert.service';
import { DateSelection } from '../../services/date/date-selection';
import { ExpenseService } from '../../services/expense/expense.service';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CategoryListComponent } from '../../components/expense/category-list/category-list.component';
import { DateFilter } from '../../components/date/date-filter';
import { ExpenseAnnualStat } from '../../components/chart/expense-annual-stat';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';
import { ExpenseList } from '../../components/expense/expense-list/expense-list';
import { ExpenseSummary } from '../../components/chart/expense-summary';
import { AnnualTotal, Expense as ExpenseType } from '../../models/expense';
import { Periodicity } from '../../models/date';

const PrimeNgImport = [Button, Card, Drawer, Skeleton];

@Component({
  selector: 'app-expense',
  imports: [
    CategoryFormComponent,
    CategoryListComponent,
    DateFilter,
    ExpenseAnnualStat,
    ExpenseFormComponent,
    ExpenseList,
    ExpenseSummary,
    ...PrimeNgImport,
  ],
  templateUrl: './expense.html',
})
export class Expense {
  private alert = inject(AlertService);
  private service = inject(ExpenseService);
  private _ds = inject(DateSelection);

  expenses?: ExpenseType[];
  displayCreateForm = false;
  loading = false;

  summary?: { category: string; total: number }[];
  summaryLoad = false;

  stats?: AnnualTotal[];
  statsLoading = false;

  constructor() {
    effect(() => this.loadExpenses());
    effect(() => this.loadAnnualStat(this._ds.year()));
    effect(() =>
      this.loadSummary(
        this._ds.isRangeMode(),
        this._ds.currentDate(),
        this._ds.rangeDate(),
        this._ds.frequency(),
      ),
    );
  }

  loadAnnualStat(year: number) {
    this.statsLoading = true;
    this.service
      .getAnnualStats(new Date(`${year}/01/01`))
      .then((data) => (this.stats = data))
      .catch((e) => console.error(e))
      .finally(() => (this.statsLoading = false));
  }

  loadSummary(
    asRange: boolean,
    date: Date,
    range: [Date, Date],
    f: Periodicity,
  ) {
    if (asRange) {
      console.log(
        'TODO get summary of date of range',
        range.map((d) => d.toLocaleString()),
      );
    } else {
      this.summaryLoad = true;
      this.service
        .getSummary(f, date)
        .then((data) => (this.summary = data))
        .catch((e) => console.error('Error when getting expense summary', e))
        .finally(() => (this.summaryLoad = false));
    }
  }

  loadExpenses() {
    this.loading = true;
    this.service
      .findAll({ date: this._ds.rangeDate() })
      .then((data) => (this.expenses = data))
      .catch(() => {
        this.alert.alert({
          type: 'error',
          message: "OUPS!! Une erreur s'est produite.",
        });
      })
      .finally(() => (this.loading = false));
  }
}
