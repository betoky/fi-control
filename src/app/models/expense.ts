export type Category = {
  id: number;
  name: string;
  color: string;
  bg: string;
}

export type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  quantity: number | null;
  unit: string | null;
  category: Category | null;
  created_at: string;
}

export type TotalByCategory = {
  category: string;
  total: number;
}

export type AnnualTotal = {
  month: string;
  total: number;
}