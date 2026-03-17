import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, amount, type, icon }) => {
  const getGradient = () => {
    switch (type) {
      case 'budget': return 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30';
      case 'spent': return 'from-rose-500/20 to-orange-500/20 border-rose-500/30';
      case 'remaining': return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'budget': return 'text-cyan-400';
      case 'spent': return 'text-rose-400';
      case 'remaining': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 ${getGradient()} backdrop-blur-sm`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white/80 font-medium text-sm uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg bg-white/5 ${getTextColor()}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${getTextColor()}`}>$</span>
        <span className="text-4xl font-extrabold text-white tracking-tight">
          {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </motion.div>
  );
};

const BudgetSummaryCards = ({ totalBudget, totalSpent, remainingBudget }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        title="Total Budget" 
        amount={totalBudget} 
        type="budget" 
        icon={<span className="text-xl">💰</span>} 
      />
      <SummaryCard 
        title="Total Spent" 
        amount={totalSpent} 
        type="spent" 
        icon={<span className="text-xl">📉</span>} 
      />
      <SummaryCard 
        title="Remaining" 
        amount={remainingBudget} 
        type="remaining" 
        icon={<span className="text-xl">✨</span>} 
      />
    </div>
  );
};

export default BudgetSummaryCards;
