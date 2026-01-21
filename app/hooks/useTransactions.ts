import { useState, useEffect, useCallback } from 'react';

import type { Transaction, CategoryData, DailySpending, CategoryType } from '@/app/types/transaction';

const STORAGE_KEY = 'household_transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTotalBalance = useCallback(() => {
    return transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [transactions]);

  const getMonthlyNetIncome = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return { netIncome: income - expenses, income, expenses };
  }, [transactions]);

  const getSpendingBreakdown = useCallback((): CategoryData[] => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);

    const categoryMap: Record<CategoryType, { name: string; icon: string; color: string }> = {
      income: { name: '収入', icon: '💰', color: 'bg-green-500' },
      food: { name: '食費・外食', icon: '🍽️', color: 'bg-orange-500' },
      grocery: { name: '食料品', icon: '🛒', color: 'bg-green-600' },
      housing: { name: '住居費', icon: '🏠', color: 'bg-blue-500' },
      transport: { name: '交通費', icon: '🚗', color: 'bg-purple-500' },
      entertainment: { name: '娯楽', icon: '📊', color: 'bg-pink-500' },
      health: { name: '健康', icon: '💪', color: 'bg-teal-500' },
    };

    const categoryTotals = expenses.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<CategoryType, number>
    );

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: categoryMap[category as CategoryType].name,
        icon: categoryMap[category as CategoryType].icon,
        color: categoryMap[category as CategoryType].color,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const getDailySpendingTrends = useCallback((): DailySpending[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyMap: Record<string, number> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyMap[dateStr] = 0;
    }

    transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === 'expense' &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .forEach((t) => {
        dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount;
      });

    return Object.entries(dailyMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  const getRecentTransactions = useCallback((limit = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getTotalBalance,
    getMonthlyNetIncome,
    getSpendingBreakdown,
    getDailySpendingTrends,
    getRecentTransactions,
  };
}
