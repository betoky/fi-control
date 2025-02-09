import { Component, inject, OnInit } from '@angular/core';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ExpenseService } from '../../services/expense/expense.service';
import { ChipComponent } from '../../components/chip/chip.component';

const PrimeNgImport = [CardModule, FieldsetModule];

@Component({
  selector: 'app-expense',
  imports: [CategoryFormComponent, ChipComponent, ...PrimeNgImport],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  categories = this.expenseService.categories;

  ngOnInit(): void {
  }
}
