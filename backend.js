import express from "express";
import cors from "cors";
import { getJson } from "serpapi";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/news", async (req, res) => {
  const stock = req.query.stock;

  if (!stock) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  try {
    const result = await getJson({
      engine: "google_news",
      q: `${stock} stock news`,
      api_key: process.env.APIKEY
    });

    const articles = (result.news_results || [])
      .slice(0, 3)
      .map(a => ({
        title: a.title,
        source: a.source,
        link: a.link,
        date: a.date
      }));

    res.json({
      stock,
      results: articles
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
