'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import type { TransactionType, CategoryType } from '@/app/types/transaction';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (transaction: {
    description: string;
    amount: number;
    type: TransactionType;
    category: CategoryType;
    date: string;
  }) => void;
}

export function TransactionDialog({ open, onOpenChange, onSubmit }: TransactionDialogProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'income' : category,
      date,
    });

    setDescription('');
    setAmount('');
    setCategory('food');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-50">
          <Dialog.Title className="text-2xl font-bold text-slate-900 mb-6">
            クイック取引追加
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                種類
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  支出
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    type === 'income'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  収入
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                説明 *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: スーパーで買い物"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                金額 (円) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            {type === 'expense' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="food">🍽️ 食費・外食</option>
                  <option value="grocery">🛒 食料品</option>
                  <option value="housing">🏠 住居費</option>
                  <option value="transport">🚗 交通費</option>
                  <option value="entertainment">📊 娯楽</option>
                  <option value="health">💪 健康</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                日付
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                追加
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  キャンセル
                </button>
              </Dialog.Close>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="閉じる"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
