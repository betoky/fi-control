import { Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DrawerModule } from 'primeng/drawer';
import { AlertService } from '../../services/alert/alert.service';
import { CategoryService } from '../../services/expense/category.service';
import { ExpenseService } from '../../services/expense/expense.service';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CategoryListComponent } from '../../components/expense/category-list/category-list.component';
import { ExpenseEditComponent } from '../../components/expense/expense-edit/expense-edit.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';
import { ExpenseCardComponent } from "../../components/expense/expense-card/expense-card.component";
import { Expense } from '../../models/expense';
import { getStartOfWeek } from '../../utils/date.utility';

const PrimeNgImport = [ButtonModule, CardModule, DrawerModule];

@Component({
  selector: 'app-expense',
  imports: [CategoryFormComponent, CategoryListComponent, ExpenseFormComponent, ...PrimeNgImport, ExpenseCardComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
  providers: [DialogService]
})
export class ExpenseComponent implements OnInit {
  private alertService = inject(AlertService);
  private service = inject(ExpenseService);
  public dialogService = inject(DialogService);

  displayForm = false;

  expenses: Expense[] = [];
  categories = inject(CategoryService).categories;

  ref?: DynamicDialogRef;

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    const now = new Date();
    const firstDayOfWeek = getStartOfWeek(now);
    
    this.service.findAll({ date: [firstDayOfWeek.toISOString(), now.toISOString()] })
      .then(data => this.expenses = data)
      .catch(() => {
        this.alertService.alert({
          type: 'error',
          message: "OUPS!! Une erreur s'est produite."
        })
      })
  }

  onEdit(expense: Expense) {
    this.ref = this.dialogService.open(ExpenseEditComponent, {
      data: {
        expense,
        categories: this.categories()
      },
      header: 'Modification',
      modal: true,
      styleClass: "mx-4 w-full md:w-3/4 lg:w-1/2",
      contentStyle: { overflowY: 'visible' }
    })

    this.ref.onClose.pipe(take(1)).subscribe({
      next: saved => saved && this.refreshData()
    })
  }

  closeEditForm() {
    this.refreshData();
  }

  onDelete(id: number) {
    this.service.deleteExpense(id)
      .then(() => this.expenseDeleted())
      .catch(() => this.alertService.alert({ message: "La dépense n'a pas pu être supprimée", type: 'error' }))
  }

  private expenseDeleted() {
    this.alertService.alert({ message: "Une dépense a été supprimée", type: 'success' });
    this.refreshData();
  }

}
