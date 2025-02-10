import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

type ExpenseFilter = {
  q?: string;
  category?: number;
  date?: [string, string];
  amount?: [string, string];
}

type ExpenseDTO = { date: string; category_id: number | null; home_id: number; title: string; amount: number; quantity: number | null; unit: number | null; }

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private supabase = inject(SupabaseService).getInstance();

  async findAll({ q, amount, category, date }: ExpenseFilter) {

    const query = this.supabase
      .from('expense')
      .select("*, category:expense_category(color, bg, name)");

    if (q) {
      if (isNaN(parseFloat(q))) {
        query.like('title', q);
      } else {
        query.eq('amount', parseFloat(q));
      }
    }

    if (category) {
      query.eq('category_id', category);
    }

    if (amount) {
      query.gte('amount', amount[0]).lte('amount', amount[1]);
    }

    if (date) {
      query.gte('date', date[0]).lte('date', date[1]);
    }

    query.order('date', { ascending: false });

    const { data: expenses, error } = await query;
    if (error) throw error;

    return expenses;
  }

  async addExpenses(expenses: ExpenseDTO[]) {
    const { error } = await this.supabase.from('expense').insert(expenses);
    if (error) throw error;
  }

}
