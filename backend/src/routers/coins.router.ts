import { Router } from 'express';
import TrendingCoins, { getCoinHistory, SearchCoins, totalValues, trendingByVolume } from '../components/Trending-coins/index.js';

const router = Router();

router.get('/trending-coins',TrendingCoins);

router.get("/search-coins",SearchCoins);

router.get('/trending-by-volume',trendingByVolume)

router.get('/totalValues',totalValues);

router.get("/history/:id", getCoinHistory);

export default router;