'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

import { useTransactions } from '@/app/hooks/useTransactions';
import { SpendingChart } from '@/app/components/SpendingChart';

export default function ReportPage() {
  const {
    transactions,
    getSpendingBreakdown,
    getDailySpendingTrends,
    getMonthlyNetIncome,
  } = useTransactions();

  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');

  const spendingBreakdown = useMemo(() => getSpendingBreakdown(), [getSpendingBreakdown]);
  const dailyTrends = useMemo(() => getDailySpendingTrends(), [getDailySpendingTrends]);
  const { income, expenses, netIncome } = useMemo(() => getMonthlyNetIncome(), [getMonthlyNetIncome]);

  const monthlyTotal = useMemo(() => {
    return dailyTrends.reduce((sum, day) => sum + day.amount, 0);
  }, [dailyTrends]);

  const averageDailySpending = useMemo(() => {
    const daysWithSpending = dailyTrends.filter((day) => day.amount > 0).length;
    return daysWithSpending > 0 ? monthlyTotal / daysWithSpending : 0;
  }, [dailyTrends, monthlyTotal]);

  const highestSpendingDay = useMemo(() => {
    if (dailyTrends.length === 0) return null;
    return dailyTrends.reduce((max, day) => (day.amount > max.amount ? day : max), dailyTrends[0]);
  }, [dailyTrends]);

  const savingsRate = useMemo(() => {
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  }, [income, expenses]);

  const transactionCount = transactions.length;
  const incomeTransactions = transactions.filter((t) => t.type === 'income').length;
  const expenseTransactions = transactions.filter((t) => t.type === 'expense').length;

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
                <Link href="/household/budget" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  予算
                </Link>
                <Link href="/household/report" className="text-sm font-medium text-green-400">
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">財務レポート</h1>
            <p className="text-slate-400">詳細な分析とインサイトを確認しましょう</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              月次
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'year'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              年次
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">総収入</div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">¥{income.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">{incomeTransactions}件の取引</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">総支出</div>
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-400">¥{expenses.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">{expenseTransactions}件の取引</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">純収入</div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
            </div>
            <div className={`text-3xl font-bold ${netIncome >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {netIncome >= 0 ? '+' : ''}¥{netIncome.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">収入 - 支出</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">貯蓄率</div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(168, 85, 247)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>
            <div className={`text-3xl font-bold ${savingsRate >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
              {savingsRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {savingsRate >= 20 ? '優秀' : savingsRate >= 10 ? '良好' : '要改善'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Trends Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white">支出トレンド</h3>
              <p className="text-sm text-slate-400">日次支出の推移</p>
            </div>
            <SpendingChart data={dailyTrends} monthlyTotal={monthlyTotal} />

            {highestSpendingDay && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">最高支出日</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    {new Date(highestSpendingDay.date).toLocaleDateString('ja-JP', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-2xl font-bold text-red-400">
                    ¥{highestSpendingDay.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-5">カテゴリ別支出</h3>
              <div className="space-y-4">
                {spendingBreakdown.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">データがありません</p>
                ) : (
                  spendingBreakdown.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-sm font-medium text-white">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white">
                            {cat.percentage.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cat.color} transition-all duration-500`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">¥{cat.amount.toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">統計情報</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-400">平均日次支出</span>
                  <span className="text-lg font-semibold text-white">
                    ¥{averageDailySpending.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-400">総取引数</span>
                  <span className="text-lg font-semibold text-white">{transactionCount}件</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-400">支出/収入比</span>
                  <span className="text-lg font-semibold text-white">
                    {income > 0 ? (expenses / income).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
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
