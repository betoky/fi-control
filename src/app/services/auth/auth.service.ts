import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private supabase = inject(SupabaseService).getInstance();
  private authenticated = new BehaviorSubject<boolean | undefined>(undefined);

  isAuthenticated$ = this.authenticated.asObservable().pipe(filter(auth => auth !== undefined));

  private _userSession: User | undefined;

  getUserSession = () => this._userSession;

  constructor() {
    this.supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        this.authenticated.next(true);
      } else if (event === 'SIGNED_OUT') {
        this.authenticated.next(false);
      } else if (event === 'INITIAL_SESSION') {
        this.supabase.auth.getSession()
          .then(({ data: { session } }) => {
            this._userSession = session?.user;
            this.authenticated.next(session ? true : false);
          })
          .catch((e) => {
            this.authenticated.next(false);
            this.logout();
          })
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

  async updatePassword(password: string) {
    const { error } = await this.supabase.auth.updateUser({ email: this._userSession?.email, password });

    if (error) {
      throw error;
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
