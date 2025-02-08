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
  private _userSession = new BehaviorSubject<User | undefined>(undefined);

  isAuthenticated$ = this.authenticated.asObservable().pipe(filter(auth => auth !== undefined));
  userSession$ = this._userSession.asObservable().pipe(filter(user => user !== undefined));

  constructor() {
    this.supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        this.authenticated.next(true);
      } else if (event === 'SIGNED_OUT') {
        this.authenticated.next(false);
        this._userSession.next(undefined);
      } else if (event === 'INITIAL_SESSION') {
        this.supabase.auth.getSession()
          .then(({ data: { session } }) => {
            this._userSession.next(session?.user);
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
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email, password
    })

    if (error) throw error;

    this._userSession.next(data.session.user);
  }

  async updatePassword(password: string) {
    const { error } = await this.supabase.auth.updateUser({ email: this._userSession.getValue()?.email, password });
    if (error) throw error;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
