import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChipComponent } from '../../chip/chip.component';
import { ExpenseWithCategory } from '../../../models/expense';
import { DatePipe } from '../../../pipes/date.pipe';
import { CurrencyPipe } from '../../../pipes/currency.pipe';

@Component({
  selector: 'app-expense-card',
  imports: [CardModule, ChipComponent, CurrencyPipe, DatePipe],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.scss'
})
export class ExpenseCardComponent {
  @Input({ required: true }) expense!: ExpenseWithCategory;
}
