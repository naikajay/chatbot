import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

/* 🔥 SIMPLE CACHE (reduce API calls) */
const cache = new Map();

/* 🧠 MEMORY STORE (per session simple) */
let conversationHistory = [];

/* CHAT ROUTE */
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    // 🔁 CACHE CHECK
    if (cache.has(message)) {
      return res.json({ reply: cache.get(message) });
    }

    // 🧠 ADD CONTEXT (last 5 messages)
    conversationHistory.push({ role: "user", content: message });
    if (conversationHistory.length > 5) {
      conversationHistory.shift();
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: "You are a helpful college assistant chatbot."
          },
          ...conversationHistory
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.json({
        reply: "⚠️ API Error: " + data.error.message
      });
    }

    const reply =
      data.output?.[0]?.content?.[0]?.text || "⚠️ No response";

    // 💾 SAVE IN MEMORY
    conversationHistory.push({ role: "assistant", content: reply });

    // 💾 SAVE IN CACHE
    cache.set(message, reply);

    res.json({ reply });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.json({ reply: "❌ Server error" });
  }
});

/* ROOT */
app.get("/", (req, res) => {
  res.send("🚀 Optimized Chatbot Server Running");
});

/* START */
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});