import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ExpenseService } from '../../../services/expense/expense.service';
import { ChipComponent } from '../../chip/chip.component';

const PrimeNgImport = [ButtonModule, ColorPickerModule, FieldsetModule, InputTextModule, ToastModule];

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, ...PrimeNgImport, ChipComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
  providers: [MessageService]
})
export class CategoryFormComponent {
  private readonly DEFAUTL_COLOR = '#000000';
  private readonly DEFAUTL_BG = '#FFFFFF';

  categoryName?: string;
  foregroundColor: string = this.DEFAUTL_COLOR;
  backgroundColor: string = this.DEFAUTL_BG;

  isSubmiting = false;

  private service = inject(ExpenseService);
  private messageService = inject(MessageService);

  async addCategorie(form: NgForm) {
    const value = this.categoryName?.trim();
    if (value && value.length >= 3) {
      this.isSubmiting = true;
      try {
        await this.service.createExpenseCategory(value, this.foregroundColor, this.backgroundColor);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: "Une catégorie a été créée",
          life: 2500
        })
        form.resetForm();
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "La création de catégorie a échouée",
          life: 2500
        })
      } finally {
        this.isSubmiting = false;
      }
    }
  }
}
