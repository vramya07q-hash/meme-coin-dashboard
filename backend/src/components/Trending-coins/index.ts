import axios from "axios";
import type { Request, Response } from "express";

export default async function TrendingCoins(req: Request, res: Response) {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
    );

    const coins = response.data.splice(0,10).map((coin: any) => ({
      index:coin.index,
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
    }));

    return res.json(coins);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

let cachedCoins: any[] = [];
let lastFetched = 0;

export async function SearchCoins(req: Request, res: Response) {
  const { search } = req.query;

  try {
    if (Date.now() - lastFetched > 60_000) {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
      );

      cachedCoins = response.data;
      lastFetched = Date.now();
    }

    const searchValue = String(search || "").toLowerCase();

    const filteredCoins = cachedCoins
      .filter((coin: any) => {
        if (!searchValue) return true;

        return (
          coin.name.toLowerCase().includes(searchValue) ||
          coin.symbol.toLowerCase().includes(searchValue)
        );
      })
      .slice(0, 10)
      .map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
      }));

    return res.json(filteredCoins);
  } catch (error: any) {
    console.log("ERROR:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function chartData(req: Request, res: Response) {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
    );

    return response.data;
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

let lastFetchedTime = 0;
let coins: any[] = [];

export async function trendingByVolume(req: Request, res: Response) {
  try {
    if (Date.now() - lastFetchedTime > 5 * 60_000) {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "volume_desc",
            per_page: 50,
            page: 1,
            sparkline: false,
            price_change_percentage: "24h",
          },
        },
      );

      coins = response.data.slice(0, 4).map((coin: any, index: number) => ({
        index,
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        volume24h: coin.total_volume,
      }));

      lastFetchedTime = Date.now();
    }

    return res.status(200).json(coins);
  } catch (error: any) {
    console.log("CoinGecko error:", error.response?.status);
    console.log(error.response?.data);

    // If we already have cached data, return it
    if (coins.length > 0) {
      return res.status(200).json(coins);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
}

let totalValuesTime = 0;

let result = {
  totalMarketCap: 0,
  total24hVolume: 0,
  trendingCoinsCount: 0,
  top5Dominance: 0,
  totalChange24h:0
};

export async function totalValues(req: Request, res: Response) {
  try {
    if (Date.now() - totalValuesTime > 5 * 60_000) {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "volume_desc",
            per_page: 50,
            page: 1,
            sparkline: false,
            price_change_percentage: "24h",
          },
        },
      );

      const coins = response.data;

      // Original values
      const totalMarketCap = coins.reduce(
        (sum: number, coin: any) => sum + (coin.market_cap || 0),
        0,
      );

      const total24hVolume = coins.reduce(
        (sum: number, coin: any) => sum + (coin.total_volume || 0),
        0,
      );

      const totalChange24h =
        coins.reduce(
          (sum: number, coin: any) =>
            sum + (coin.price_change_percentage_24h || 0),
          0,
        ) / coins.length;
      const trendingCoinsCount = coins.length;

      const top5MarketCap = coins
        .slice()
        .sort((a: any, b: any) => (b.market_cap || 0) - (a.market_cap || 0))
        .slice(0, 5)
        .reduce((sum: number, coin: any) => sum + (coin.market_cap || 0), 0);

      const top5Dominance =
        totalMarketCap > 0 ? (top5MarketCap / totalMarketCap) * 100 : 0;

      // Convert USD values to billions
      result = {
        totalMarketCap: totalMarketCap / 1_000_000_000,
        total24hVolume: total24hVolume / 1_000_000_000,
        trendingCoinsCount,
        top5Dominance,
        totalChange24h
      };

      totalValuesTime = Date.now();
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.log("CoinGecko error:", error.response?.status);
    console.log(error.response?.data);

    if (result.totalMarketCap > 0) {
      return res.status(200).json(result);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
}


