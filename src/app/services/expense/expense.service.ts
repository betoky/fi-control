import { inject, Injectable, signal } from '@angular/core';
import { QueryData } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { HomeService } from '../home/home.service';
import { cacheSupabaseQuery, removeCached } from '../../utils/cache.utility';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly CATEGORIES_KEY = 'expense-categories'
  private supabase = inject(SupabaseService).getInstance();
  private homeService = inject(HomeService);

  private categoriesQuery = this.supabase.from('expense_category').select('*').order('name', { ascending: true });

  categories = signal<QueryData<typeof this.categoriesQuery> | null>(null)

  constructor() {
    this.streamCategories();
  }

  async createExpenseCategory(name: string, color: string, bg: string) {
    const home = await this.homeService.getHome();
    if (!home) throw new Error("Not allowed to create expense category");

    const { error } = await this.supabase.from('expense_category').insert([{ name, bg, color, home_id: home.id }]);
    if (error) throw error;
    removeCached(this.CATEGORIES_KEY);
    this.streamCategories();
  }

  async getCategories() {
    type Query = QueryData<typeof this.categoriesQuery>;
    return cacheSupabaseQuery<Query>(this.CATEGORIES_KEY, this.categoriesQuery);
  }
  
  async deleteCategory(id: number) {
    const { error } = await this.supabase.from('expense_category').delete().eq('id', id);
    if (error) throw error;
    removeCached(this.CATEGORIES_KEY);
    this.streamCategories();
  }

  private streamCategories() {
    this.getCategories().then(data => this.categories.set(data));
  }
}
