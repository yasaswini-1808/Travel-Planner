import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'flights', label: 'Flights', icon: '✈️' },
  { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { id: 'food', label: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', label: 'Transport', icon: '🚕' },
  { id: 'activities', label: 'Activities', icon: '🎫' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'other', label: 'Other', icon: '📦' },
];

const ExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    
    onAddExpense({
      title,
      amount,
      category,
      date
    });

    setTitle('');
    setAmount('');
    // keep category and date
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
    >
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-indigo-400">➕</span> Add Expense
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Expense Name</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dinner at Paris"
            className="w-full bg-[#0A0C16] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Amount ($)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#0A0C16] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0A0C16] border border-white/10 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              ▼
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#0A0C16] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        >
          Add Expense
        </button>
      </form>
    </motion.div>
  );
};

export default ExpenseForm;
