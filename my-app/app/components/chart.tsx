
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import axios from "axios";
import { useEffect, useState } from "react";

const chartConfig = {
  price: {
    label: "Price",
    color: "#00ff88",
  },
} satisfies ChartConfig;

interface PriceChartProps {
  days: number | "max";
  id: string;
}

interface PricePoint {
  time: number;
  price: number;
}

export default function PriceChart({ days, id }: PriceChartProps) {
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data only when the coin ID changes
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

     async function fetchChartData() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get<[number, number][]>(
          `http://localhost:3000/api/coins/history/${encodeURIComponent(id)}?days=${days}`
        );

        const formattedData: PricePoint[] = response.data.map(
          ([time,price]) => ({
            time,
            price,
          })
        );

        if (!cancelled) {
          setChartData(formattedData);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching chart data:", err);
          setError(
            axios.isAxiosError(err) && err.response?.status === 429
              ? "CoinGecko rate limit reached. Please try again later."
              : "Unable to load price history."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchChartData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Change the visible range locally, without requesting the API again
  const filteredData = chartData.filter((point) => {
    if (days === "max") return true;

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return point.time >= cutoff;
  });

  return (
    <div className="w-full h-[200px] xl:h-[250px]">
      <Card className="h-full w-full bg-gray-800 border-gray-700 overflow-hidden">
        <CardContent className="h-[190px] xl:h-[240px] p-0">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Loading chart...
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center px-3 text-center text-sm text-red-400">
              {error}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No price history available
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
            >
              <AreaChart
                data={filteredData}
                margin={{
                  left: 5,
                  right: 5,
                  top: 5,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#00ff88"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor="#00ff88"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical
                  horizontal
                  stroke="#12365c"
                  strokeDasharray="0"
                />

                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tick={{ fill: "#9ca3af", fontSize: 9 }}
                  tickCount={4}
                  minTickGap={20}
                  tickFormatter={(value) =>
                    new Date(Number(value)).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />

                <YAxis
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tick={{ fill: "#9ca3af", fontSize: 9 }}
                  tickFormatter={(value) => Number(value).toFixed(6)}
                  domain={["auto", "auto"]}
                />

                <ChartTooltip
                  cursor={{
                    stroke: "#00ff88",
                    strokeWidth: 1,
                  }}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) => {
                        const timestamp = Number(value);

                        if (!Number.isFinite(timestamp)) return "";

                        return new Date(timestamp).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        });
                      }}
                      formatter={(value) => [
                        Number(value).toFixed(10),
                        " Price",
                      ]}
                    />
                  }
                />

                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#00ff88"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                  fillOpacity={1}
                  dot={false}
                  activeDot={{
                    r: 3,
                    fill: "#00ff88",
                  }}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}