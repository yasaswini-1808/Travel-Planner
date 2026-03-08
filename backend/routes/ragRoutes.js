import express from "express";
import Groq from "groq-sdk";
import { authenticateToken } from "../middleware/auth.js";
import {
  validateBody,
  ragQuerySchema,
  ragAnswerSchema,
} from "../middleware/validate.js";
import { retrieveContext } from "../services/ragService.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post(
  "/search",
  authenticateToken,
  validateBody(ragQuerySchema),
  async (req, res) => {
    try {
      const { query, limit } = req.body;
      const data = await retrieveContext({
        query,
        userId: req.user?.id,
        limit: limit || 5,
      });

      res.json({
        message: "RAG retrieval successful",
        query,
        matches: data.results,
      });
    } catch (error) {
      res.status(500).json({
        error: "RAG search failed",
        details: error.message,
      });
    }
  },
);

router.post(
  "/answer",
  authenticateToken,
  validateBody(ragAnswerSchema),
  async (req, res) => {
    try {
      const { question } = req.body;
      const retrieved = await retrieveContext({
        query: question,
        userId: req.user?.id,
        limit: 6,
      });

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content:
              "You are a travel assistant. Use only the provided context to answer. If context is insufficient, say what is missing briefly.",
          },
          {
            role: "user",
            content: `Question: ${question}\n\nContext:\n${retrieved.contextText || "No context found."}`,
          },
        ],
      });

      res.json({
        answer: completion.choices?.[0]?.message?.content || "",
        contextMatches: retrieved.results,
      });
    } catch (error) {
      res.status(500).json({
        error: "RAG answer generation failed",
        details: error.message,
      });
    }
  },
);

export default router;
