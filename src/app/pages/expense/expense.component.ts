import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { ToastModule } from 'primeng/toast';
import { ExpenseService } from '../../services/expense/expense.service';
import { ChipComponent } from '../../components/chip/chip.component';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';

const PrimeNgImport = [CardModule, ConfirmDialogModule, FieldsetModule, ToastModule];

@Component({
  selector: 'app-expense',
  imports: [CategoryFormComponent, ChipComponent, ...PrimeNgImport],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ExpenseComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private messageService = inject(MessageService);
  private confirmation = inject(ConfirmationService);

  categories = this.expenseService.categories;
  categoryToDelete = signal<number | null>(null);

  ngOnInit(): void {
  }

  async onDeleteCategory(id: number) {
    const toDelete = this.categories()?.find(category => category.id === id);
    this.confirmation.confirm({
      header: 'Une catégorie va être supprimée',
      message: 'Vous allez supprimer ' + toDelete?.name,
      blockScroll: true,
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger',
      },
      accept: () => {
        this.processToRemoveCategory(id);
      },
    })
  }

  private async processToRemoveCategory(id: number) {
    try {
      this.categoryToDelete.set(id);
      await this.expenseService.deleteCategory(id);
      this.success("Une catégorie a été supprimée");
    } catch (error) {
      this.failed("La suppression de catégorie est échouée");
    } finally {
      this.categoryToDelete.set(null);
    }
  }

  private success(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: message,
      life: 2500
    })
  }

  private failed(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: message,
      life: 2500
    })
  }
}
