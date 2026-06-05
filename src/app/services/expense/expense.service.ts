import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Expense } from '../../models/expense';
import { Periodicity } from '../../models/date';
import { rpcSummaryOf } from '../../utils/supabase.utility';

type ExpenseFilter = {
  q?: string;
  category?: number;
  date?: [Date, Date];
  amount?: [string, string];
}

type ExpenseDTO = { date: string; category_id: number | null; home_id: number; title: string; amount: number; quantity: number | null; unit: string | null; }

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private supabase = inject(SupabaseService).getInstance().schema('public');

  async findAll({ q, amount, category, date }: ExpenseFilter) {
    const query = this.supabase
      .from('expense')
      .select("*, category:expense_category(*)");

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
      query.gte('date', date[0].toISOString()).lte('date', date[1].toISOString());
    }

    query.order('date', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return data;
  }

  async addExpenses(expenses: ExpenseDTO[]) {
    const { error } = await this.supabase.from('expense').insert(expenses);
    if (error) throw error;
  }

  async updateExpense(expense: Expense) {
    const { category, id, ...data } = expense;
    const { error } = await this.supabase.from('expense').update({ ...data, category_id: category?.id }).eq('id', id);
    if (error) throw error;
  }

  async deleteExpense(id: number) {
    const { error } = await this.supabase.from('expense').delete().eq('id', id);
    if (error) throw error;
  }

  async getSummary(frequency: Periodicity, date: Date) {
    const summary = rpcSummaryOf(frequency);
    const { error, data } = await this.supabase.rpc(summary, { param: date.toISOString() });
    if (error) throw error;
    return data as { category: string; total: number }[];
  }

  async getStats(date: Date) {
    const { error, data } = await this.supabase.rpc('annual_statistics', { param: date.toISOString() });
    if (error) throw error;
    return data;
  }

}
