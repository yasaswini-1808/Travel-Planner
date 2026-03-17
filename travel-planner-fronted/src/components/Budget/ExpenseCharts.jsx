import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#38BDF8', '#818CF8', '#FB923C', '#FBBF24', '#FB7185', '#C084FC', '#9CA3AF'];
const CATEGORY_NAMES = {
  flights: 'Flights', accommodation: 'Accommodation', food: 'Food',
  transport: 'Transport', activities: 'Activities', shopping: 'Shopping', other: 'Other'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0C16] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="font-bold text-white mb-1">{payload[0].name}</p>
        <p className="text-lg text-indigo-400 font-medium">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseCharts = ({ expenses }) => {
  // Aggregate data for Pie Chart
  const pieData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .map(([key, value]) => ({
        name: CATEGORY_NAMES[key] || key,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Aggregate data for Bar Chart (by date)
  const barData = useMemo(() => {
    const dateTotals = expenses.reduce((acc, exp) => {
      acc[exp.date] = (acc[exp.date] || 0) + exp.amount;
      return acc;
    }, {});

    return Object.entries(dateTotals)
      .map(([date, amount]) => ({
        name: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        amount,
        rawDate: date
      }))
      .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md h-full flex flex-col items-center justify-center min-h-[400px]"
      >
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-white mb-2">No Data to Visualize</h3>
        <p className="text-white/50 text-center max-w-sm">
          Add some expenses to see your beautiful spending breakdowns and trends here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-indigo-400">🥧</span> Spending by Category
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Daily Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-cyan-400">📈</span> Daily Spending Trends
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0A0C16] border border-white/10 p-3 rounded-xl shadow-xl">
                        <p className="text-white/70 text-sm mb-1">{payload[0].payload.name}</p>
                        <p className="text-cyan-400 font-bold">${payload[0].value.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#6366F1" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={40}
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorGradient)`} />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseCharts;
