import { Component, effect, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Drawer } from 'primeng/drawer';
import { Skeleton } from "primeng/skeleton";
import { AlertService } from '../../services/alert/alert.service';
import { DateFilterService } from '../../services/date/date-filter.service';
import { ExpenseService } from '../../services/expense/expense.service';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CategoryListComponent } from '../../components/expense/category-list/category-list.component';
import { DateFilterComponent } from '../../components/date-filter/date-filter.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';
import { ExpenseListComponent } from '../../components/expense/expense-list/expense-list.component';
import { Expense } from '../../models/expense';

const PrimeNgImport = [Button, Card, Drawer, Skeleton];

@Component({
  selector: 'app-expense',
  imports: [
    CategoryFormComponent,
    CategoryListComponent,
    DateFilterComponent,
    ExpenseFormComponent,
    ExpenseListComponent,
    ...PrimeNgImport,
],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent {
  private alertService = inject(AlertService);
  private service = inject(ExpenseService);
  private dateFilter = inject(DateFilterService);

  expenses?: Expense[];
  displayCreateForm = false;
  loading = false;

  constructor() {
    effect(() => this.loadExpenses())
  }

  loadExpenses() {
    this.loading = true;
    this.service.findAll({ date: this.dateFilter.rangeDate()})
      .then(data => this.expenses = data)
      .catch(() => {
        this.alertService.alert({
          type: 'error',
          message: "OUPS!! Une erreur s'est produite."
        })
      })
      .finally(() => this.loading = false);
  }

}
