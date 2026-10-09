import { Router } from 'express';
import TrendingCoins, { getCoinHistory, SearchCoins, totalValues, trendingByVolume } from '../components/Trending-coins/index.js';
import axios from 'axios';

const router = Router();

router.get('/trending-coins',TrendingCoins);

router.get("/search-coins",SearchCoins);

router.get('/trending-by-volume',trendingByVolume)

router.get('/totalValues',totalValues);

router.get("/history/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const days = String(req.query.days ?? "365");

    if (!id) {
      res.status(400).json({
        message: "Coin ID is required",
      });
      return;
    }

    const prices = await getCoinHistory(id, days);
    res.json(prices);
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 429
    ) {
      res.status(429).json({
        message: "CoinGecko rate limit reached. Please try again later.",
      });
      return;
    }

    console.error("Error fetching coin history:", error);

    res.status(500).json({
      message: "Failed to fetch coin history",
    });
  }
});

export default router;