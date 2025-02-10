import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { AlertService } from '../../services/alert/alert.service';
import { ExpenseService } from '../../services/expense/expense.service';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CategoryListComponent } from '../../components/expense/category-list/category-list.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';
import { ExpenseCardComponent } from "../../components/expense/expense-card/expense-card.component";
import { ExpenseWithCategory } from '../../models/expense';
import { getStartOfWeek } from '../../utils/date.utility';

const PrimeNgImport = [ButtonModule, CardModule, DrawerModule];

@Component({
  selector: 'app-expense',
  imports: [CategoryFormComponent, CategoryListComponent, ExpenseFormComponent, ...PrimeNgImport, ExpenseCardComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit {
  private alertService = inject(AlertService);
  private service = inject(ExpenseService);

  displayForm = false;

  expenses: ExpenseWithCategory[] = [];

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    const firstDayOfWeek = getStartOfWeek(new Date());
    const now = new Date();
    
    this.service.findAll({ date: [firstDayOfWeek.toISOString(), now.toISOString()] })
      .then(data => this.expenses = data)
      .catch(() => {
        this.alertService.alert({
          type: 'error',
          message: "OUPS!! Une erreur s'est produite."
        })
      })
  }

}
