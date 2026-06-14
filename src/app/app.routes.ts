import { Routes } from '@angular/router';
import { authGuard } from './services/guards/auth/auth.guard';
import { homeGuard } from './services/guards/home/home.guard';
import { noHomeGuard } from './services/guards/home/no-home.guard';
import { noAuthGuard } from './services/guards/auth/no-auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LayoutComponent } from './components/layout/layout.component';
import { Expense } from './pages/expense/expense';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [authGuard, noHomeGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard, homeGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'expense',
        component: Expense
      },
      {
        path: 'bank',
        component: DashboardComponent
      },
      {
        path: '', redirectTo: '/dashboard', pathMatch: 'full'
      }
    ]
  }
];
