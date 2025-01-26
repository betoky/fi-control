import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private supabase = inject(SupabaseService).getInstance();
  private authenticated = new BehaviorSubject<boolean | undefined>(undefined);

  isAuthenticated$ = this.authenticated.asObservable().pipe(filter(auth => auth !== undefined));

  constructor() {
    this.supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        this.authenticated.next(true);
      } else if (event === 'SIGNED_OUT') {
        this.authenticated.next(false);
      } else {
        this.authenticated.next(false);
      }
    })
  }

  async login(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email, password
    })

    if (error) {
      throw error;
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
    this.router.navigate(['/auth/login'], {replaceUrl: true});
  }
}
