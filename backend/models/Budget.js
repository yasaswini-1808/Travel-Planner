import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "flights",
        "accommodation",
        "food",
        "transport",
        "activities",
        "shopping",
        "other",
      ],
      default: "other",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { _id: true },
);

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    totalBudget: {
      type: Number,
      default: 5000,
      min: 0,
    },
    expenses: {
      type: [expenseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Budget = mongoose.model("Budget", budgetSchema, "budgets");

export default Budget;
