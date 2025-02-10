import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { Tables } from '../../../../database.types';
import { ExpenseService } from '../../services/expense/expense.service';
import { CategoryFormComponent } from '../../components/expense/category-form/category-form.component';
import { CategoryListComponent } from '../../components/expense/category-list/category-list.component';
import { ChipComponent } from '../../components/chip/chip.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';

const PrimeNgImport = [ButtonModule, CardModule, DrawerModule];

type ExpenseWithCategorie = Tables<'expense'> & { category: { color: string; bg: string; name: string } | null };

@Component({
  selector: 'app-expense',
  imports: [CategoryFormComponent, ChipComponent, CategoryListComponent, CurrencyPipe, DatePipe, ExpenseFormComponent, ...PrimeNgImport],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit {
  private service = inject(ExpenseService);

  displayForm = false;

  expenses: ExpenseWithCategorie[] = [
    {
      id: 1,
      created_at: "2025-02-09T16:24:02.632003+00:00",
      title: "Groceries",
      quantity: 5,
      amount: 150.00,
      date: "2023-10-01T12:00:00",
      home_id: 55,
      category_id: 6,
      category: {
        bg: "#ebebeb",
        name: "Appareil informatique",
        color: "#001670"
      }
    },
    {
      id: 2,
      created_at: "2025-02-09T16:24:02.632003+00:00",
      title: "Utilities",
      quantity: 1,
      amount: 75.50,
      date: "2023-10-02T12:00:00",
      home_id: 55,
      category_id: 3,
      category: {
        bg: "#a6ccf5",
        name: "Education",
        color: "#1c171c"
      }
    },
    {
      id: 3,
      created_at: "2025-02-09T16:24:02.632003+00:00",
      title: "Rent",
      quantity: 1,
      amount: 1200.00,
      date: "2023-10-03T12:00:00",
      home_id: 55,
      category_id: 5,
      category: {
        bg: "#bfd9f5",
        name: "Rano",
        color: "#000000"
      }
    },
    {
      id: 4,
      created_at: "2025-02-09T16:24:02.632003+00:00",
      title: "Dining Out",
      quantity: 2,
      amount: 60.00,
      date: "2023-10-04T12:00:00",
      home_id: 55,
      category_id: 2,
      category: {
        bg: "#73fab9",
        name: "Santé",
        color: "#3e0b8a"
      }
    },
    {
      id: 5,
      created_at: "2025-02-09T16:24:02.632003+00:00",
      title: "Transportation",
      quantity: 10,
      amount: 100.00,
      date: "2023-10-05T12:00:00",
      home_id: 55,
      category_id: 4,
      category: {
        bg: "#d9ff00",
        name: "Vêtements",
        color: "#fa37fa"
      }
    }
  ];

  ngOnInit(): void {
    // this.service.findAll({})
    //   .then(data => this.expenses = data)
    //   .catch(error => console.error(error))
  }

  refreshData() {
    console.log('++ Refresh data...');
    
  }

}
