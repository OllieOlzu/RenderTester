import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "No message provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.APIKEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful chatbot." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    // 🔍 Log OpenAI response (very useful on Render)
    console.log("OpenAI response:", JSON.stringify(data, null, 2));

    // ❌ Handle OpenAI-side errors
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return res.json({
        reply: "⚠️ OpenAI error: " + data.error.message
      });
    }

    // ✅ Safely extract model reply
    const reply =
      data.choices?.[0]?.message?.content ??
      "⚠️ No response from model.";

    res.json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      reply: "⚠️ Internal server error"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
