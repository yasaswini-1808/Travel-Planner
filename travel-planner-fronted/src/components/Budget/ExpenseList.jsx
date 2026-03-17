import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_MAP = {
  flights: { label: 'Flights', icon: '✈️', color: 'text-sky-400', bg: 'bg-sky-400/10' },
  accommodation: { label: 'Accommodation', icon: '🏨', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  food: { label: 'Food', icon: '🍽️', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  transport: { label: 'Transport', icon: '🚕', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  activities: { label: 'Activities', icon: '🎫', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  shopping: { label: 'Shopping', icon: '🛍️', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  other: { label: 'Other', icon: '📦', color: 'text-gray-400', bg: 'bg-gray-400/10' },
};

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
    >
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-cyan-400">📋</span> Recent Expenses
      </h2>

      {expenses.length === 0 ? (
        <div className="text-center py-8 text-white/40">
          <div className="text-4xl mb-3">👻</div>
          <p>No expenses added yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
          `}</style>
          
          <AnimatePresence>
            {expenses.map((expense) => {
              const catConfig = CATEGORY_MAP[expense.category] || CATEGORY_MAP.other;
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0A0C16]/80 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${catConfig.bg}`}>
                      {catConfig.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white/90">{expense.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          📅 {new Date(expense.date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full bg-white/5 border border-white/5 ${catConfig.color}`}>
                          {catConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                    <span className="font-bold text-lg text-white">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                      aria-label="Delete expense"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ExpenseList;
