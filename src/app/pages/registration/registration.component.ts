import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';
import { Toast } from 'primeng/toast';
import { HomeService } from '../../services/home/home.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/user.interface';


const PrimeNgImport = [ButtonModule, CheckboxModule, FloatLabel, InputTextModule, PasswordModule, Toast];

@Component({
  selector: 'app-registration',
  imports: [...PrimeNgImport, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  providers: [MessageService]
})
export class RegistrationComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
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

  currentUser = signal<IUser | null>(null);


  passwordsMatch(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirm')?.value;
    return password === confirmPassword ? null : { passwordsNotMatching: true };
  }

  ngOnInit(): void {
    this.userService.getUser()
      .then(user => this.currentUser.set(user))
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue. Reloader la page',
          life: 2500
        })
      })
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
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue. Réessayez plutard.',
          life: 3000,
        })
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

}
