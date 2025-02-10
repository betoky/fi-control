import { Component, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipComponent } from '../../chip/chip.component';
import { CategoryService } from '../../../services/expense/category.service';
import { AlertService } from '../../../services/alert/alert.service';

const PrimeNgImport = [ConfirmDialogModule];

@Component({
  selector: 'app-category-list',
  imports: [ChipComponent, ...PrimeNgImport],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  providers: [ConfirmationService]
})
export class CategoryListComponent {
  private service = inject(CategoryService);
  private alertService = inject(AlertService);
  private confirmation = inject(ConfirmationService);

  categories = this.service.categories;
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
      await this.service.deleteCategory(id);
      this.alertService.alert({
        message: "Une catégorie a été supprimée",
        type: 'success'
      });
    } catch (error) {
      this.alertService.alert({
        message: "La suppression de catégorie est échouée",
        type: 'error'
      });
    } finally {
      this.categoryToDelete.set(null);
    }
  }

}
