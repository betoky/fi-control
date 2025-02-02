import { Routes } from '@angular/router';
import { authGuard } from './services/guards/auth/auth.guard';
import { homeGuard } from './services/guards/home/home.guard';
import { noHomeGuard } from './services/guards/home/no-home.guard';
import { noAuthGuard } from './services/guards/auth/no-auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistrationComponent } from './pages/registration/registration.component';

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
    component: DashboardComponent,
    canActivate: [authGuard, homeGuard]
  }
];
