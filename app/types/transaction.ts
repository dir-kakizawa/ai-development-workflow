export type TransactionType = 'income' | 'expense';

export type CategoryType =
  | 'income'
  | 'grocery'
  | 'housing'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'food';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  date: string;
  createdAt: number;
}

export interface CategoryData {
  name: string;
  icon: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface DailySpending {
  date: string;
  amount: number;
}
