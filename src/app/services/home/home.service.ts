import { inject, Injectable } from '@angular/core';
import { QueryData } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { getCached, setCache } from '../../utils/cache.utility';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private supabase = inject(SupabaseService).getInstance();

  constructor() { }

  async getHome() {
    const homeWithOwner = this.supabase.from('home').select('*, owner:users(*)').maybeSingle();
    type HomeWithOwner = QueryData<typeof homeWithOwner>;

    const cachedData = getCached<HomeWithOwner>('home');
    if (cachedData) {
      return cachedData;
    }

    const {data: home, error} = await homeWithOwner;

    if (error) throw error;

    setCache('home', home);

    return home;
  }

  async createHome(name: string, ownerId: number) {
    const { error } = await this.supabase.from('home').insert([{ name, owner_id: ownerId }]);
    if (error) throw error;
  }

  async hasHome() {
    const cached = getCached<boolean>('hasHome');
    if (cached !== null) {
      return cached;
    }
    const { data, error } = await this.supabase.from('home').select('*').maybeSingle();

    if (error) throw error;

    const hasOne = data !== null;
    setCache('hasHome', hasOne);

    return hasOne;
  }
}
