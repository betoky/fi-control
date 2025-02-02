import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { IUser } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase = inject(SupabaseService).getInstance();
  private authService = inject(AuthService);

  constructor() { }


  async getUser() {
    const uid = this.authService.getUserSession()?.id;
    if (!uid) throw new Error("No user connected");

    const { data, error } = await this.supabase.from('users').select('id, name, email').eq('supabase_id', uid).limit(1).single();

    if (error) {
      throw error;
    }

    return data as IUser;
  }

  async saveName(name: string, userId: number) {
    const { error } = await this.supabase
      .from('users')
      .update({ name })
      .eq('id', userId)

    if (error) {
      throw error;
    }
  }
}
