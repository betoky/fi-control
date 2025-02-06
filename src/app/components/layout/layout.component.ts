import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { Chip } from 'primeng/chip';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { PopoverModule } from 'primeng/popover';

import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { FirstCharPipe } from '../../pipes/first-char.pipe';

@Component({
  selector: 'app-layout',
  imports: [ButtonModule, CommonModule, Chip, FirstCharPipe, PopoverModule, Menubar, RouterOutlet, RouterModule,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-line',
      routerLink: '/dashboard'
    },
    {
      label: 'Dépenses',
      icon: 'pi pi-shopping-bag',
      routerLink: '/expense'
    },
    {
      label: 'Banque',
      icon: 'pi pi-building-columns',
      routerLink: '/bank'
    }
  ]
  username?: string;
  authService = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit() {
    this.userService.getUser()
      .then(user => this.username = user.name ?? user.email)
  }
}
