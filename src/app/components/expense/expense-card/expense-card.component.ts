import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from "primeng/menu";
import { ChipComponent } from '../../chip/chip.component';
import { Expense } from '../../../models/expense';
import { DatePipe } from '../../../pipes/date.pipe';
import { CurrencyPipe } from '../../../pipes/currency.pipe';

@Component({
  selector: 'app-expense-card',
  imports: [Button, Card, ConfirmDialog, ChipComponent, CurrencyPipe, DatePipe, Menu],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.scss',
  providers: [ConfirmationService]
})
export class ExpenseCardComponent {
  @Input({ required: true }) expense!: Expense;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  private confirm = inject(ConfirmationService);

  menus: MenuItem[] = [
    {
      label: "Modifier",
      icon: 'pi pi-pencil',
      command: () => this.edit.next()
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => this.confirmDelete()
    }
  ]

  confirmDelete() {
    this.confirm.confirm({
      position: 'bottom',
      header: 'Confirmation',
      message: 'Allez-vous supprimer cette dépense?',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'NON',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'OUI',
        severity: 'danger'
      },
      accept: () => {
        this.delete.next();
      }
    })
  }
}
