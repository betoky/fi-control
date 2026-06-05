import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { CategoryService } from '../../../services/expense/category.service';
import { Expense } from '../../../models/expense';
import { ExpenseCardComponent } from '../expense-card/expense-card.component';
import { ExpenseEditComponent } from '../expense-edit/expense-edit.component';
import { ExpenseService } from '../../../services/expense/expense.service';
import { take } from 'rxjs/operators';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-expense-list',
  imports: [CardModule, ExpenseCardComponent, SkeletonModule],
  templateUrl: './expense-list.component.html',
  providers: [DialogService]
})
export class ExpenseListComponent {
  @Output() refresh = new EventEmitter<void>();

  expenses = input<Expense[]>();

  private alertService = inject(AlertService);
  private categories = inject(CategoryService).categories;
  public dialogService = inject(DialogService);
  private service = inject(ExpenseService);
  editDialogRef?: DynamicDialogRef;

  onDelete(id: number) {
    this.service.deleteExpense(id)
      .then(() => {
        this.alertService.alert({ message: "Une dépense a été supprimée", type: 'success' });
        this.refresh.next();
      })
      .catch(() => this.alertService.alert({ message: "La dépense n'a pas pu être supprimée", type: 'error' }))
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
      next: saved => saved && this.refresh.next()
    });
  }
}
