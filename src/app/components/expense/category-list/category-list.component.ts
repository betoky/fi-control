import { Component, inject, signal } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ChipComponent } from '../../chip/chip.component';
import { ExpenseService } from '../../../services/expense/expense.service';

const PrimeNgImport = [ConfirmDialogModule, ToastModule];

@Component({
  selector: 'app-category-list',
  imports: [ChipComponent, ...PrimeNgImport],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  private expenseService = inject(ExpenseService);
  private messageService = inject(MessageService);
  private confirmation = inject(ConfirmationService);

  categories = this.expenseService.categories;
  categoryToDelete = signal<number | null>(null);

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
