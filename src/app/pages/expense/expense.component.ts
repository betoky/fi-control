import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DrawerModule } from 'primeng/drawer';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from '../../services/alert/alert.service';
import { CategoryService } from '../../services/expense/category.service';
import { ExpenseService } from '../../services/expense/expense.service';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CategoryListComponent } from '../../components/expense/category-list/category-list.component';
import { DateFilterComponent } from '../../components/date-filter/date-filter.component';
import { ExpenseEditComponent } from '../../components/expense/expense-edit/expense-edit.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';
import { ExpenseCardComponent } from "../../components/expense/expense-card/expense-card.component";
import { Expense } from '../../models/expense';
import { isPeriodictyType, Periodicity } from '../../models/date';
import { getRangeOf } from '../../utils/date.utility';

const PrimeNgImport = [ButtonModule, CardModule, DrawerModule, SkeletonModule];

@Component({
  selector: 'app-expense',
  imports: [
    CategoryFormComponent,
    CategoryListComponent,
    DateFilterComponent,
    ExpenseCardComponent,
    ExpenseFormComponent,
    ...PrimeNgImport
  ],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
  providers: [DialogService]
})
export class ExpenseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private service = inject(ExpenseService);
  public dialogService = inject(DialogService);

  displayCreateForm = false;
  editDialogRef?: DynamicDialogRef;

  expenses?: Expense[];
  categories = inject(CategoryService).categories;

  currentDate: Date = new Date();
  rangeDate?: [Date, Date];
  frequency: Periodicity = 'daily';
  isRangeMode = false;

  ngOnInit(): void {
    const frequency = this.route.snapshot.queryParamMap.get('f');
    const timestamp = this.route.snapshot.queryParamMap.get('d');
    const startTimeStamp = this.route.snapshot.queryParamMap.get('s');
    const endTimeStamp = this.route.snapshot.queryParamMap.get('e');

    if (startTimeStamp && endTimeStamp && !isNaN(+startTimeStamp) && !isNaN(+endTimeStamp)) {
      this.isRangeMode = true;
      this.rangeDate = [new Date(+startTimeStamp), new Date(+endTimeStamp)]
    } else {
      if (frequency && isPeriodictyType(frequency)) {
        this.frequency = frequency;
      }
      if (timestamp && !isNaN(+timestamp)) {
        this.currentDate = new Date(+timestamp);
      }
    }
    
    this.refreshCurrentExpenses();
  }

  onEdit(expense: Expense) {
    this.editDialogRef = this.dialogService.open(ExpenseEditComponent, {
      data: {
        expense,
        categories: this.categories()
      },
      header: 'Modification',
      modal: true,
      styleClass: "mx-4 w-full md:w-3/4 lg:w-1/2",
      contentStyle: { overflowY: 'visible' }
    })

    this.editDialogRef.onClose.pipe(take(1)).subscribe({
      next: saved => saved && this.refreshCurrentExpenses()
    })
  }

  onDelete(id: number) {
    this.service.deleteExpense(id)
      .then(() => this.expenseDeleted())
      .catch(() => this.alertService.alert({ message: "La dépense n'a pas pu être supprimée", type: 'error' }))
  }

  private expenseDeleted() {
    this.alertService.alert({ message: "Une dépense a été supprimée", type: 'success' });
    this.refreshCurrentExpenses();
  }

  onFilterByDateRange(range: [Date, Date]) {
    if (this.isRangeMode) this.updateRangeSateOfRangeMode(range);
    this.fetchExpenses(range);
  }

  updateFrequencyState(value: Periodicity) {
    this.frequency = value;
    const queryParam: Params = { 'f': value, 'd': this.currentDate.valueOf()};
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParam
    })
  }

  updateCurrentDateState(value: Date) {
    this.currentDate = value;
    const queryParam: Params = { 'f': this.frequency, 'd': value.valueOf()};
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParam
    })
  }

  private updateRangeSateOfRangeMode([start, end]: [Date, Date]) {
    const queryParams: Params = { s: start.valueOf(), e: end.valueOf() }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    })
  }

  refreshCurrentExpenses() {
    if (this.isRangeMode && this.rangeDate) {
      this.fetchExpenses(this.rangeDate);
    } else {
      this.fetchExpenses(getRangeOf(this.frequency, this.currentDate));
    }
  }

  private fetchExpenses([start, end]: [Date, Date]) {
    this.service.findAll({ date: [start.toISOString(), end.toISOString()] })
      .then(data => this.expenses = data)
      .catch(() => {
        this.alertService.alert({
          type: 'error',
          message: "OUPS!! Une erreur s'est produite."
        })
      })
  }

}
