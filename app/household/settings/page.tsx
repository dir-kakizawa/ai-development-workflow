'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useTransactions } from '@/app/hooks/useTransactions';

export default function SettingsPage() {
  const { transactions } = useTransactions();
  const [notifications, setNotifications] = useState({
    budgetAlert: true,
    weeklyReport: false,
    transactionReminder: true,
  });

  const handleExportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `household-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'すべてのデータを削除してもよろしいですか？この操作は元に戻せません。'
      )
    ) {
      localStorage.removeItem('household_transactions');
      window.location.reload();
    }
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
                <Link href="/household/budget" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  予算
                </Link>
                <Link href="/household/report" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  レポート
                </Link>
                <Link href="/household/settings" className="text-sm font-medium text-green-400">
                  設定
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">設定</h1>
          <p className="text-slate-400">アプリケーションの設定を管理しましょう</p>
        </div>

        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">通知設定</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium mb-1">予算アラート</h3>
                  <p className="text-sm text-slate-400">予算の80%を超えたときに通知します</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, budgetAlert: !prev.budgetAlert }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.budgetAlert ? 'bg-green-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.budgetAlert ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium mb-1">週次レポート</h3>
                  <p className="text-sm text-slate-400">毎週月曜日に支出レポートを送信します</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, weeklyReport: !prev.weeklyReport }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.weeklyReport ? 'bg-green-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium mb-1">取引リマインダー</h3>
                  <p className="text-sm text-slate-400">取引の記録を忘れないようにリマインドします</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      transactionReminder: !prev.transactionReminder,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.transactionReminder ? 'bg-green-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.transactionReminder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">カテゴリ管理</h2>
            <div className="space-y-3">
              {[
                { name: '食費・外食', icon: '🍽️', count: transactions.filter(t => t.category === 'food').length },
                { name: '食料品', icon: '🛒', count: transactions.filter(t => t.category === 'grocery').length },
                { name: '住居費', icon: '🏠', count: transactions.filter(t => t.category === 'housing').length },
                { name: '交通費', icon: '🚗', count: transactions.filter(t => t.category === 'transport').length },
                { name: '娯楽', icon: '📊', count: transactions.filter(t => t.category === 'entertainment').length },
                { name: '健康', icon: '💪', count: transactions.filter(t => t.category === 'health').length },
              ].map((category, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="text-white font-medium">{category.name}</h3>
                      <p className="text-xs text-slate-400">{category.count}件の取引</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
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
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
              + 新しいカテゴリを追加
            </button>
          </div>

          {/* Data Management Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">データ管理</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="text-white font-medium mb-2">データのエクスポート</h3>
                <p className="text-sm text-slate-400 mb-4">
                  すべての取引データをJSON形式でエクスポートします
                </p>
                <button
                  onClick={handleExportData}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  データをエクスポート
                </button>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="text-white font-medium mb-2">データのインポート</h3>
                <p className="text-sm text-slate-400 mb-4">
                  以前にエクスポートしたデータをインポートします
                </p>
                <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                  データをインポート
                </button>
              </div>

              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-white font-medium mb-2">データの削除</h3>
                <p className="text-sm text-slate-400 mb-4">
                  すべての取引データを完全に削除します。この操作は元に戻せません。
                </p>
                <button
                  onClick={handleClearData}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  すべてのデータを削除
                </button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">アプリケーション情報</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-400">バージョン</span>
                <span className="text-white font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-400">総取引数</span>
                <span className="text-white font-medium">{transactions.length}件</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-400">データサイズ</span>
                <span className="text-white font-medium">
                  {(JSON.stringify(transactions).length / 1024).toFixed(2)} KB
                </span>
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
