import React, { useEffect, useState } from "react";
import axios from "axios";
import BudgetSummaryCards from "./BudgetSummaryCards";
import ExpenseForm from "./ExpenseForm";
import ExpenseCharts from "./ExpenseCharts";
import ExpenseList from "./ExpenseList";

const API_URL = "/api/budget";

const BudgetAnalyzer = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(5000);
  const [budgetInput, setBudgetInput] = useState("5000");
  const [loading, setLoading] = useState(true);

  const syncBudgetState = (data) => {
    const nextBudget = Number(data?.totalBudget || 0);
    setTotalBudget(nextBudget);
    setBudgetInput(String(nextBudget));
    setExpenses(
      (data?.expenses || []).map((expense) => ({
        ...expense,
        id: expense._id || expense.id,
        amount: Number(expense.amount || 0),
      })),
    );
  };

  // Fetch initial data from backend
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        syncBudgetState(res.data);
      } catch (err) {
        console.error("Failed to load budget", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
  }, []);

  const addExpense = async (expense) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/expense`, expense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      syncBudgetState(res.data);
    } catch (err) {
      console.error("Failed to add expense", err);
    }
  };

  const deleteExpense = async (id) => {
    const previousExpenses = expenses;

    try {
      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== id),
      );

      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      syncBudgetState(res.data);
    } catch (err) {
      setExpenses(previousExpenses);
      console.error("Failed to delete expense", err);
    }
  };

  const updateBudget = async () => {
    const parsed = parseFloat(budgetInput);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setBudgetInput(String(totalBudget));
      return;
    }

    setTotalBudget(parsed);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/total`,
        { totalBudget: parsed },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      syncBudgetState(res.data);
    } catch (err) {
      setBudgetInput(String(totalBudget));
      console.error("Failed to update total budget", err);
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = totalBudget - totalSpent;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A12] flex items-center justify-center text-white font-['Syne']">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080A12] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-['Syne']">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Budget Analyzer
            </h1>
            <p className="text-white/60 mt-1">
              Track your travel expenses and manage your budget.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-xl border border-white/10">
            <span className="text-white/70 font-medium">Total Budget:</span>
            <div className="flex items-center gap-1">
              <span className="text-indigo-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                onBlur={updateBudget}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    updateBudget();
                  }
                }}
                className="bg-transparent border-b border-indigo-500/50 w-24 text-white focus:outline-none focus:border-indigo-400 font-bold text-lg"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <BudgetSummaryCards
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & List */}
          <div className="lg:col-span-1 space-y-8">
            <ExpenseForm onAddExpense={addExpense} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>

          {/* Right Column: Charts */}
          <div className="lg:col-span-2 space-y-8">
            <ExpenseCharts expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalyzer;
