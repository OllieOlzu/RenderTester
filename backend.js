import express from "express";
import cors from "cors";
import SerpApi from "serpapi";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/news", async (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  try {
    const client = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

    const params = {
      engine: "google_news",
      q: `latest ${symbol} stock news`,
      hl: "en",
      gl: "us"
    };

    const results = await client.getJson(params);

    const articles = (results.news_results || [])
      .slice(0, 3)
      .map(a => ({
        title: a.title,
        source: a.source,
        link: a.link,
        date: a.date
      }));

    res.json({ symbol, articles });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
