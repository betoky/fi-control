import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ExpenseService } from '../../../services/expense/expense.service';
import { ChipComponent } from '../../chip/chip.component';

const PrimeNgImport = [ButtonModule, ColorPickerModule, FieldsetModule, InputTextModule, PanelModule, SelectModule, ToastModule];

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
  private service = inject(ExpenseService);
  private messageService = inject(MessageService);
  private toEdit: number| null = null;

  categoryName?: string;
  foregroundColor: string = this.DEFAUTL_COLOR;
  backgroundColor: string = this.DEFAUTL_BG;

  categories = this.service.categories;

  isSubmiting = false;


  async addCategorie(form: NgForm) {
    const value = this.categoryName?.trim();
    if (value && value.length >= 3) {
      this.isSubmiting = true;
      try {
        if (this.toEdit) {
          await this.service.updateExpenseCategory(this.toEdit, value, this.foregroundColor, this.backgroundColor);
        } else {
          await this.service.createExpenseCategory(value, this.foregroundColor, this.backgroundColor);
        }
        this.alert(this.toEdit ? 'La catégorie a été modifiée' : 'Une catégorie a été créée', 'success');
        form.resetForm();
      } catch (error) {
        this.alert(this.toEdit ? 'La modification de catégorie a échouée' : "La création de catégorie a échouée", 'error');
      } finally {
        this.isSubmiting = false;
      }
    }
  }

  onEdit(e: SelectChangeEvent) {
    if (e.value) {
      const el = this.categories()!.at(0)!;
      type Category = typeof el;
      const { id, name, color, bg }: Category = e.value;
      this.toEdit = id;
      this.categoryName = name;
      this.foregroundColor = color;
      this.backgroundColor = bg;
    } else {
      this.toEdit = null;
      this.categoryName = undefined;
      this.foregroundColor = this.DEFAUTL_COLOR;
      this.backgroundColor = this.DEFAUTL_BG;
    }
  }

  private alert(message: string, type: 'error' | 'success') {
    this.messageService.add({
      severity: type,
      summary: type === 'error' ? 'Erreur' : 'Succès',
      detail: message,
      life: 2500
    })
  }
}
