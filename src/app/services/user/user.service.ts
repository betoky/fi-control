import { inject, Injectable } from '@angular/core';
import { QueryData } from '@supabase/supabase-js';
import { from, of } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { getCached, setCache } from '../../utils/cache.utility';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase = inject(SupabaseService).getInstance();
  private authService = inject(AuthService);

  constructor() { }

  getUser() {
    return this.authService.userSession$.pipe(
      switchMap(session => {
        const userQuery = this.supabase.from('users').select('*').eq('supabase_id', session.id).limit(1).single();
        type User = QueryData<typeof userQuery>;

        const cachedUser = getCached<User>('user');
        if (cachedUser) {
          return of(cachedUser);
        }

        const userQueryPromise = new Promise<User | null>((resolve, reject) => {
          userQuery.then(({ data, error }) => {
            if (error) reject(error);

            setCache('user', data);
            resolve(data);
          })
        })

        return from(userQueryPromise)
      })
    )
  }

  async saveName(name: string, userId: number) {
    const { error } = await this.supabase
      .from('users')
      .update({ name })
      .eq('id', userId)

    if (error) throw error;
  }
}
