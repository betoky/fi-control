import { Tables } from "../../../database.types";

export type ExpenseWithCategory = Tables<'expense'> & { category: { color: string; bg: string; name: string } | null };