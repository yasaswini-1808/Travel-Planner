import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config({ path: "../.env" });
console.log("ENV FILE:", process.env.GROQ_API_KEY);
// DEBUG: check if API key is loaded
console.log("Groq Key in route:", !!process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a travel assistant. Suggest destinations, itineraries, and tips.",
        },
        ...(history || []),
        { role: "user", content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("LLaMA error:", err);
    res.status(500).json({ error: "LLaMA API failed" });
  }
});

export default router;
