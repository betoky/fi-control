import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { isAuthApiError } from '@supabase/supabase-js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';

import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

const PrimeNgImport = [ButtonModule, CheckboxModule, InputTextModule, Toast];

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ...PrimeNgImport],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
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
        const errorMsg = isAuthApiError(error) ?
          "Échec de l'authentification. Veuillez vérifier vos identifiants." :
          "Une erreur s'est produite. Veuillez réessayer";
        this.messageService.add({
          severity: 'error',
          detail: errorMsg,
          life: 6000
        })
      } finally {
        this.loading = false;
      }
    }
  }
}
