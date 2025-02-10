import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';
import { HomeService } from '../../services/home/home.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alert/alert.service';

const PrimeNgImport = [ButtonModule, CheckboxModule, FloatLabel, InputTextModule, PasswordModule];

@Component({
  selector: 'app-registration',
  imports: [...PrimeNgImport, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private homeService = inject(HomeService);
  private userService = inject(UserService);

  isLoading = signal(false);
  registrationForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    password: ['', Validators.required],
    confirm: ['', Validators.required],
    home: ['', Validators.required],

  }, { validators: this.passwordsMatch })

  currentUser = toSignal(inject(UserService).getUser().pipe(filter(user => user !== null)));

  passwordsMatch(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirm')?.value;
    return password === confirmPassword ? null : { passwordsNotMatching: true };
  }

  async onSubmit() {
    const user = this.currentUser();
    if (this.registrationForm.valid && user) {
      const { name, home, password } = this.registrationForm.getRawValue();
      try {
        this.isLoading.set(true);
        await this.userService.saveName(name, user.id);
        await this.authService.updatePassword(password);
        await this.homeService.createHome(home, user.id);
        this.router.navigate(['/'], { replaceUrl: true });
      } catch (e) {
        this.alertService.alert({
          type: 'error',
          message: 'Une erreur est survenue. Réessayez plutard.'
        })
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

}
