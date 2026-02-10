import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve index.html from /public

// Web search endpoint
app.post("/search", async (req, res) => {
  const query = req.body.query;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const response = await fetch("https://ollama.com/api/web_search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OLLAMA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching search results" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
