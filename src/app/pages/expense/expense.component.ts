import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CategoryListComponent } from '../../components/expense/category-list/category-list.component';

const PrimeNgImport = [CardModule, ConfirmDialogModule, ToastModule];

@Component({
  selector: 'app-expense',
  imports: [CategoryFormComponent, CategoryListComponent, ...PrimeNgImport],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ExpenseComponent implements OnInit {

  ngOnInit(): void {
  }

}
