import express from "express";
import Budget from "../models/Budget.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const formatBudgetResponse = (budget) => ({
  totalBudget: Number(budget.totalBudget || 0),
  expenses: (budget.expenses || []).map((expense) => ({
    _id: expense._id,
    title: expense.title,
    amount: Number(expense.amount || 0),
    category: expense.category,
    date: expense.date,
  })),
});

const getOrCreateBudget = async (userId) => {
  let budget = await Budget.findOne({ userId });

  if (!budget) {
    budget = await Budget.create({ userId });
  }

  return budget;
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    const budget = await getOrCreateBudget(req.user.id);
    return res.status(200).json(formatBudgetResponse(budget));
  } catch (error) {
    console.error("❌ Budget fetch error:", error.message);
    return res.status(500).json({ error: "Failed to fetch budget" });
  }
});

router.put("/total", authenticateToken, async (req, res) => {
  try {
    const parsedBudget = Number(req.body?.totalBudget);

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({ error: "Valid totalBudget is required" });
    }

    const budget = await getOrCreateBudget(req.user.id);
    budget.totalBudget = parsedBudget;
    await budget.save();

    return res.status(200).json(formatBudgetResponse(budget));
  } catch (error) {
    console.error("❌ Budget update error:", error.message);
    return res.status(500).json({ error: "Failed to update budget" });
  }
});

router.post("/expense", authenticateToken, async (req, res) => {
  try {
    const title = String(req.body?.title || "").trim();
    const amount = Number(req.body?.amount);
    const category = String(req.body?.category || "other").trim();
    const parsedDate = new Date(req.body?.date || Date.now());

    if (!title) {
      return res.status(400).json({ error: "Expense title is required" });
    }

    if (!Number.isFinite(amount) || amount < 0) {
      return res
        .status(400)
        .json({ error: "Valid expense amount is required" });
    }

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Valid expense date is required" });
    }

    const budget = await getOrCreateBudget(req.user.id);
    budget.expenses.push({
      title,
      amount,
      category,
      date: parsedDate,
    });
    await budget.save();

    return res.status(201).json(formatBudgetResponse(budget));
  } catch (error) {
    console.error("❌ Add expense error:", error.message);
    return res.status(500).json({ error: "Failed to add expense" });
  }
});

router.delete("/expense/:expenseId", authenticateToken, async (req, res) => {
  try {
    const budget = await getOrCreateBudget(req.user.id);
    const expense = budget.expenses.id(req.params.expenseId);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    expense.deleteOne();
    await budget.save();

    return res.status(200).json(formatBudgetResponse(budget));
  } catch (error) {
    console.error("❌ Delete expense error:", error.message);
    return res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
