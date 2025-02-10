import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { ChipComponent } from '../../chip/chip.component';
import { CategoryService } from '../../../services/expense/category.service';
import { AlertService } from '../../../services/alert/alert.service';

const PrimeNgImport = [ButtonModule, ColorPickerModule, FieldsetModule, InputTextModule, PanelModule, SelectModule];

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, ...PrimeNgImport, ChipComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  private readonly DEFAUTL_COLOR = '#000000';
  private readonly DEFAUTL_BG = '#FFFFFF';
  private service = inject(CategoryService);
  private alertService = inject(AlertService);
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
        this.alertService.alert({
          message: this.toEdit ? 'La catégorie a été modifiée' : 'Une catégorie a été créée',
          type: 'success'
        });
        form.resetForm();
      } catch (error) {
        this.alertService.alert({
          message: this.toEdit ? 'La modification de catégorie a échouée' : "La création de catégorie a échouée",
          type: 'error'
        });
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
}
