import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { isAuthApiError } from '@supabase/supabase-js';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';

import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alert/alert.service';

const PrimeNgImport = [ButtonModule, CheckboxModule, FloatLabel, InputTextModule, PasswordModule];

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ...PrimeNgImport],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private authSubscription?: Subscription;

  loginForm = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe({
      next: isAuth => isAuth && this.router.navigate(['/'], {replaceUrl: true})
    })
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    this.loading = true;
    
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.getRawValue();
        await this.authService.login(email, password);
      } catch (error) {
        this.alertService.alert({
          type: 'error',
          message: isAuthApiError(error) ?
          "Échec de l'authentification, veuillez vérifier vos identifiants." : 
          "Une erreur s'est produite. Veuillez réessayer."
        })
      } finally {
        this.loading = false;
      }
    }
  }
}
