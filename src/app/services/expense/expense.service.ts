import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { HomeService } from '../home/home.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private supabase = inject(SupabaseService).getInstance();
  private homeService = inject(HomeService);

  constructor() { }

  async createExpenseCategory(name: string, color: string, bg: string) {
    const home = await this.homeService.getHome();
    if (!home) throw new Error("Not allowed to create expense category");

    const { error } = await this.supabase.from('expense_category').insert([{ name, bg, color, home_id: home.id }]);
    if (error) throw error;
  }
}
