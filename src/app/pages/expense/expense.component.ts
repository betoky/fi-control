import { Component } from '@angular/core';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';

const PrimeNgImport = [CardModule, FieldsetModule];

@Component({
  selector: 'app-expense',
  imports: [CategoryFormComponent, ...PrimeNgImport],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent {

}
