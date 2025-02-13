import { inject, Injectable } from '@angular/core';
import { QueryData } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { cacheSupabaseQuery, getCached, removeCached, setCache } from '../../utils/cache.utility';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly HOME_KEY = 'home';
  private readonly HAS_HOME_KEY = 'hasHome';
  private supabase = inject(SupabaseService).getInstance();

  constructor() { }

  async getHome() {
    const homeWithOwner = this.supabase.from('home').select('*, owner:users(*)').maybeSingle();
    type HomeWithOwner = QueryData<typeof homeWithOwner>;

    return cacheSupabaseQuery<HomeWithOwner>(this.HOME_KEY, homeWithOwner);
  }

  async createHome(name: string, ownerId: number) {
    const { error } = await this.supabase.from('home').insert([{ name, owner_id: ownerId }]);
    if (error) throw error;
    this.clearCachedHome();
  }

  async hasHome() {
    const cached = getCached<boolean>(this.HAS_HOME_KEY);
    if (cached !== null) {
      return cached;
    }
    const { data, error } = await this.supabase.from('home').select('*').maybeSingle();

    if (error) throw error;

    const hasOne = data !== null;
    setCache(this.HAS_HOME_KEY, hasOne);

    return hasOne;
  }

  clearCachedHome() {
    removeCached(this.HOME_KEY);
    removeCached(this.HAS_HOME_KEY);
  }
}
