import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Category, Expense } from '../../../models/expense';
import { AlertService } from '../../../services/alert/alert.service';
import { ExpenseService } from '../../../services/expense/expense.service';

const PrimeNgImport = [ButtonModule, FloatLabel, InputNumberModule, InputTextModule, SelectModule];

@Component({
  selector: 'app-expense-edit',
  imports: [ReactiveFormsModule, ...PrimeNgImport],
  templateUrl: './expense-edit.component.html',
  styleUrl: './expense-edit.component.scss'
})
export class ExpenseEditComponent implements OnInit {
  categories: Category[] | null = null;

  public ref = inject(DynamicDialogRef);
  public dialogService = inject(DialogService);

  dialogInstance = this.dialogService.getInstance(this.ref);
  hasChange = false;

  private id?: number;
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private service = inject(ExpenseService);

  submitting = false;

  form?: FormGroup;

  ngOnInit(): void {
    this.categories = this.dialogInstance.data['categories'];
    const expense = this.dialogInstance.data['expense'] as Expense;
    this.id = expense.id;
    this.form = this.fb.group({
      title: [expense.title, Validators.required],
      amount: [expense.amount, [Validators.required, Validators.min(0)]],
      category: [expense.category],
      quantity: [expense.quantity],
      unit: [expense.unit]
    });

    this.form.valueChanges.pipe(take(1)).subscribe({
      next: () => this.hasChange = true
    })
  }

  onSubmit() {
    if (this.form?.valid) {
      this.submitting = true;
      this.service.updateExpense({id: this.id, ...this.form.getRawValue()})
        .then(() => {
          this.alertService.alert({message: 'Dépense mis à jour.', type: 'success'});
          this.ref.close(true);
        })
        .catch(() => this.alertService.alert({message: "La dépense n'a pas été modifiée.", type: 'error'}))
        .finally(() => this.submitting = false)
    }
  }

  onClose() {
    this.ref.close(false);
  }
}
