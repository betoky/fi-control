import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { ExpenseService } from '../../../services/expense/expense.service';
import { HomeService } from '../../../services/home/home.service';
import { AlertService } from '../../../services/alert/alert.service';
import { Expense } from '../../../models/expense';
import { CategoryService } from '../../../services/expense/category.service';

const PrimeNgImport = [ButtonModule, DatePickerModule, FloatLabel, InputNumberModule, InputTextModule, SelectModule];

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, ...PrimeNgImport],
  templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent {
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private service = inject(ExpenseService);
  private homeService = inject(HomeService);
  categories = inject(CategoryService).categories;

  @Output() saved = new EventEmitter<void>();

  submitting = false;

  form = this.fb.group({
    date: [new Date(), Validators.required],
    items: this.fb.array([this.createItem()])
  })

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      amount: [, [Validators.required, Validators.min(0)]],
      category: [],
      quantity: [],
      unit: []
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      try {
        this.submitting = true;
        const home = await this.homeService.getHome();
        const { date, items } = this.form.getRawValue();
        const expenses = items.map(item => {
          const { category, ...data } = item as Expense;
          return { ...data, date: date!.toISOString(), category_id: category?.id ?? null, home_id: home!.id }
        })
        await this.service.addExpenses(expenses);
        this.saved.next();
        this.items.clear();
        this.alertService.alert({
          type: 'success',
          message: "Les dépenses sont ajoutées."
        })
      } catch (error) {
        this.alertService.alert({
          type: 'success',
          message: "Les dépenses n'ont pas pu ajouter."
        })
      } finally {
        this.submitting = false;
      }
    }
  }

}
