'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

import { useTransactions } from '@/app/hooks/useTransactions';

import type { CategoryType } from '@/app/types/transaction';

interface BudgetItem {
  category: CategoryType;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  color: string;
}

const DEFAULT_BUDGETS: Record<CategoryType, number> = {
  income: 0,
  food: 50000,
  grocery: 30000,
  housing: 80000,
  transport: 20000,
  entertainment: 30000,
  health: 15000,
};

export default function BudgetPage() {
  const { getSpendingBreakdown, getMonthlyNetIncome } = useTransactions();
  const [budgets, setBudgets] = useState<Record<CategoryType, number>>(DEFAULT_BUDGETS);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [editValue, setEditValue] = useState('');

  const spendingBreakdown = useMemo(() => getSpendingBreakdown(), [getSpendingBreakdown]);
  const { expenses } = useMemo(() => getMonthlyNetIncome(), [getMonthlyNetIncome]);

  const budgetItems: BudgetItem[] = useMemo(() => {
    const categoryMap: Record<CategoryType, { name: string; icon: string; color: string }> = {
      income: { name: '収入', icon: '💰', color: 'bg-green-500' },
      food: { name: '食費・外食', icon: '🍽️', color: 'bg-orange-500' },
      grocery: { name: '食料品', icon: '🛒', color: 'bg-green-600' },
      housing: { name: '住居費', icon: '🏠', color: 'bg-blue-500' },
      transport: { name: '交通費', icon: '🚗', color: 'bg-purple-500' },
      entertainment: { name: '娯楽', icon: '📊', color: 'bg-pink-500' },
      health: { name: '健康', icon: '💪', color: 'bg-teal-500' },
    };

    const spendingMap = spendingBreakdown.reduce(
      (acc, item) => {
        const category = Object.keys(categoryMap).find(
          (key) => categoryMap[key as CategoryType].name === item.name
        ) as CategoryType | undefined;
        if (category) {
          acc[category] = item.amount;
        }
        return acc;
      },
      {} as Record<CategoryType, number>
    );

    return Object.entries(categoryMap)
      .filter(([category]) => category !== 'income')
      .map(([category, meta]) => ({
        category: category as CategoryType,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        budget: budgets[category as CategoryType],
        spent: spendingMap[category as CategoryType] || 0,
      }))
      .sort((a, b) => b.budget - a.budget);
  }, [spendingBreakdown, budgets]);

  const totalBudget = useMemo(() => {
    return Object.entries(budgets)
      .filter(([category]) => category !== 'income')
      .reduce((sum, [, amount]) => sum + amount, 0);
  }, [budgets]);

  const handleEditBudget = (category: CategoryType) => {
    setEditingCategory(category);
    setEditValue(budgets[category].toString());
  };

  const handleSaveBudget = () => {
    if (editingCategory && editValue) {
      const newAmount = parseInt(editValue, 10);
      if (!isNaN(newAmount) && newAmount >= 0) {
        setBudgets((prev) => ({ ...prev, [editingCategory]: newAmount }));
      }
    }
    setEditingCategory(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const getPercentage = (spent: number, budget: number) => {
    if (budget === 0) return 0;
    return (spent / budget) * 100;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-400';
    if (percentage >= 80) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <Link href="/" className="text-xl font-bold text-white hover:text-green-400 transition-colors">
                  Vantage Finance
                </Link>
              </div>
              <nav className="flex items-center gap-6">
                <Link href="/household" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  概要
                </Link>
                <Link href="/household/budget" className="text-sm font-medium text-green-400">
                  予算
                </Link>
                <Link href="/household/report" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  レポート
                </Link>
                <Link href="/household/settings" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  設定
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">予算管理</h1>
          <p className="text-slate-400">カテゴリ別の予算を設定し、支出を管理しましょう</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Budget Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="text-sm text-slate-400 mb-2">月次予算総額</div>
            <div className="text-4xl font-bold text-white mb-2">¥{totalBudget.toLocaleString()}</div>
            <div className="text-xs text-slate-500">全カテゴリ合計</div>
          </div>

          {/* Total Spent Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="text-sm text-slate-400 mb-2">当月支出</div>
            <div className="text-4xl font-bold text-red-400 mb-2">¥{expenses.toLocaleString()}</div>
            <div className="text-xs text-slate-500">支出合計</div>
          </div>

          {/* Remaining Budget Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="text-sm text-slate-400 mb-2">残り予算</div>
            <div className={`text-4xl font-bold mb-2 ${totalBudget - expenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ¥{(totalBudget - expenses).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">
              {totalBudget > 0 ? `${((expenses / totalBudget) * 100).toFixed(0)}% 使用` : '予算未設定'}
            </div>
          </div>
        </div>

        {/* Budget List */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">カテゴリ別予算</h2>
          <div className="space-y-6">
            {budgetItems.map((item) => {
              const percentage = getPercentage(item.spent, item.budget);
              const isEditing = editingCategory === item.category;

              return (
                <div key={item.category} className="border-b border-slate-700/50 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-400">
                            支出: <span className="text-white font-medium">¥{item.spent.toLocaleString()}</span>
                          </span>
                          <span className="text-slate-400">
                            予算: {isEditing ? (
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-32 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                                autoFocus
                              />
                            ) : (
                              <span className="text-white font-medium">¥{item.budget.toLocaleString()}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getStatusColor(percentage)}`}>
                          {percentage.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          残り ¥{(item.budget - item.spent).toLocaleString()}
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveBudget}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            保存
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditBudget(item.category)}
                          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                        >
                          編集
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  {/* Warning Message */}
                  {percentage >= 100 && (
                    <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span>予算を超過しています！</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-700/50">
          <p className="text-center text-sm text-slate-500">
            © 2023 VANTAGE HOUSEHOLD ACCOUNTING — SIMPLE, OPTIMIZED, PRIVATE.
          </p>
        </footer>
      </div>
    </div>
  );
}
