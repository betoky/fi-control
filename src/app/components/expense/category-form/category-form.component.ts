import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ExpenseService } from '../../../services/expense/expense.service';
import { ChipComponent } from '../../chip/chip.component';

const PrimeNgImport = [ButtonModule, ColorPickerModule, InputTextModule, ToastModule];

const DEFAUTL_COLOR = '#000000';
const DEFAUTL_BG = '#FFFFFF';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, ...PrimeNgImport, ChipComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
  providers: [MessageService]
})
export class CategoryFormComponent {
  categoryName?: string;
  foregroundColor: string = DEFAUTL_COLOR;
  backgroundColor: string = DEFAUTL_BG;

  isSubmiting = false;

  private service = inject(ExpenseService);
  private messageService = inject(MessageService);

  addCategorie() {
    if (this.categoryName && this.categoryName.length >= 3) {
      this.service.createExpenseCategory(this.categoryName, this.foregroundColor, this.backgroundColor)
        .then(() => {
          this.categoryName = undefined;
          this.foregroundColor = DEFAUTL_COLOR;
          this.backgroundColor = DEFAUTL_BG;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: "Une catégorie a été créée",
            life: 2500
          })
        })
        .catch(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "La création de catégorie a échouée",
            life: 2500
          })
        })
        .finally(() => this.isSubmiting = false)
    }
  }
}
