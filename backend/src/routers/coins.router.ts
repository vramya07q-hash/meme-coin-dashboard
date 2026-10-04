import { Router } from 'express';
import TrendingCoins, { SearchCoins, trendingByVolume } from '../components/Trending-coins/index.js';

const router = Router();

router.get('/trending-coins',TrendingCoins);

router.get("/search-coins",SearchCoins);

router.get('/trending-by-volume',trendingByVolume)

export default router;