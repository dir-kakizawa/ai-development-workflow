'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

import { useTransactions } from '@/app/hooks/useTransactions';
import { SpendingChart } from '@/app/components/SpendingChart';
import { TransactionDialog } from '@/app/components/TransactionDialog';

import type { Transaction } from '@/app/types/transaction';

export default function HouseholdPage() {
  const {
    addTransaction,
    getTotalBalance,
    getMonthlyNetIncome,
    getSpendingBreakdown,
    getDailySpendingTrends,
    getRecentTransactions,
  } = useTransactions();

  const [dialogOpen, setDialogOpen] = useState(false);

  const totalBalance = useMemo(() => getTotalBalance(), [getTotalBalance]);
  const { netIncome, income, expenses } = useMemo(() => getMonthlyNetIncome(), [getMonthlyNetIncome]);
  const spendingBreakdown = useMemo(() => getSpendingBreakdown(), [getSpendingBreakdown]);
  const dailyTrends = useMemo(() => getDailySpendingTrends(), [getDailySpendingTrends]);
  const recentTransactions = useMemo(() => getRecentTransactions(), [getRecentTransactions]);

  const monthlyTotal = useMemo(() => {
    return dailyTrends.reduce((sum, day) => sum + day.amount, 0);
  }, [dailyTrends]);

  const lastWeekSpending = useMemo(() => {
    const lastWeek = dailyTrends.slice(-7);
    return lastWeek.reduce((sum, day) => sum + day.amount, 0);
  }, [dailyTrends]);

  const prevWeekSpending = useMemo(() => {
    const prevWeek = dailyTrends.slice(-14, -7);
    return prevWeek.reduce((sum, day) => sum + day.amount, 0);
  }, [dailyTrends]);

  const weeklyChange = useMemo(() => {
    if (prevWeekSpending === 0) return 0;
    return ((lastWeekSpending - prevWeekSpending) / prevWeekSpending) * 100;
  }, [lastWeekSpending, prevWeekSpending]);

  const getCategoryIcon = (description: string): string => {
    const lower = description.toLowerCase();
    if (lower.includes('salary') || lower.includes('給料')) return '💰';
    if (lower.includes('food') || lower.includes('レストラン')) return '🛒';
    if (lower.includes('gas') || lower.includes('ガソリン')) return '⛽';
    if (lower.includes('netflix') || lower.includes('subscription')) return '🎬';
    if (lower.includes('gym') || lower.includes('ジム')) return '💪';
    return '💳';
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const sign = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-green-400' : 'text-red-400';
    return <span className={color}>{sign}¥{amount.toLocaleString()}</span>;
  };

  const topCategory = spendingBreakdown[0];

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
                <Link href="/household" className="text-sm font-medium text-green-400">
                  概要
                </Link>
                <Link href="/household/budget" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
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
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="取引を検索..."
                  className="w-64 px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Total Balance Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="text-sm text-slate-400 mb-2">総残高</div>
              <div className="text-4xl font-bold text-green-400 mb-2">
                ¥{totalBalance.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-400">+2.4%</span>
                <span className="text-sm text-slate-500">先月比</span>
              </div>
            </div>

            {/* Monthly Net Income Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="text-sm text-slate-400 mb-2">月次純収入</div>
              <div className="text-4xl font-bold text-white mb-2">
                {netIncome >= 0 ? '+' : ''}¥{netIncome.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${weeklyChange < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)}%
                </span>
                <span className="text-sm text-slate-500">支出増加</span>
              </div>
            </div>

            {/* Spending Breakdown Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-5">支出内訳</h3>
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
              {spendingBreakdown.length > 0 && (
                <button className="w-full mt-5 py-2 text-sm text-green-400 hover:text-green-300 font-medium transition-colors">
                  詳細なカテゴリを表示
                </button>
              )}
            </div>

            {/* Smart Insight Card */}
            {topCategory && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
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
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">スマートインサイト</h3>
                    <p className="text-sm text-slate-400">
                      今週は{topCategory.name}の支出が先週と比べて{Math.abs(weeklyChange).toFixed(0)}%
                      {weeklyChange < 0 ? '減少' : '増加'}しています。その調子で続けましょう！
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  予算を更新
                </button>
              </div>
            )}

            {/* Quick Transaction Button */}
            <button
              onClick={() => setDialogOpen(true)}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 border border-green-500/50 shadow-xl hover:from-green-500 hover:to-green-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-semibold text-white">クイック取引</div>
                    <div className="text-sm text-green-100">支出または収入を追加</div>
                  </div>
                </div>
                <svg
                  className="text-white group-hover:translate-x-1 transition-transform"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </button>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Spending Trends Chart */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white">日次支出トレンド</h3>
                <p className="text-sm text-slate-400">2023年10月の概要</p>
              </div>
              <SpendingChart data={dailyTrends} monthlyTotal={monthlyTotal} />
            </div>

            {/* Recent Transactions */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold text-white">最近の取引</h3>
                <button className="text-sm text-green-400 hover:text-green-300 font-medium transition-colors">
                  すべてのアクティビティを表示
                </button>
              </div>

              {recentTransactions.length === 0 ? (
                <p className="text-center text-slate-500 py-8">まだ取引がありません</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                          説明
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                          カテゴリ
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                          日付
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                          金額
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction: Transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-lg">
                                {getCategoryIcon(transaction.description)}
                              </div>
                              <span className="text-sm font-medium text-white">
                                {transaction.description}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-400 capitalize">
                              {transaction.category === 'income' && '収入'}
                              {transaction.category === 'food' && '食費・外食'}
                              {transaction.category === 'grocery' && '食料品'}
                              {transaction.category === 'housing' && '住居費'}
                              {transaction.category === 'transport' && '交通費'}
                              {transaction.category === 'entertainment' && '娯楽'}
                              {transaction.category === 'health' && '健康'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-400">
                              {new Date(transaction.date).toLocaleDateString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-sm font-semibold">
                              {formatAmount(transaction.amount, transaction.type)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={addTransaction} />
    </div>
  );
}
