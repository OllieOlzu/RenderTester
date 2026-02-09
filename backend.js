import express from "express";
import cors from "cors";
import "dotenv/config";
import Groq from "groq-sdk"; // ✔ correct package

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Initialize the Groq SDK client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided" });

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a friendly assistant." },
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",  // or any other supported model
    });

    // The API returns an array of choices
    const reply = completion.choices?.[0]?.message?.content || "";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error contacting Groq API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
