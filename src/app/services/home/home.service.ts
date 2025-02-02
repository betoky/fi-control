import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private supabase = inject(SupabaseService).getInstance();
  private authService = inject(AuthService);

  constructor() { }


  async createHome(name: string, ownerId: number) {
    const { error } = await this.supabase.from('home').insert([{ name, owner_id: ownerId, members_id: [ownerId] }]);
    if (error) {
      throw error;
    }
  }

  async hasHome() {
    const { data, error } = await this.supabase.from('home').select('*');

    if (error) {
      throw error;
    }

    return data.length > 0;
  }
}
