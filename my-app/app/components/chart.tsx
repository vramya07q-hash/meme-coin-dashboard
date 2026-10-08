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
  CardHeader,
  CardTitle,
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
  days: number;
}

export default function PriceChart(days:PriceChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  async function fetchChartData() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/coins/history/pepe?days=${days}`
      );

      console.log("the day from response:",days);

      const formattedData = response.data.map(
        (item: [number, number]) => ({
          time: item[0],
          price: item[1],
        })
      );

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  }

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className="w-full h-[200px] xl:h-[250px] ">
      <Card className="h-full w-full bg-[#061b35] border-[#12365c] overflow-hidden">

        {/* Chart */}
        <CardContent className="h-[190px] xl:h-[240px] p-0">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full"
          >
            <AreaChart
              data={chartData}
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
                strokeDasharray="0"
                vertical={true}
                horizontal={true}
                stroke="#12365c"
              />

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fill: "#9ca3af", fontSize: 9 }}
                tickCount={4}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString([], {
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
                tickFormatter={(value) =>
                  Number(value).toFixed(6)
                }
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

                      if (!Number.isFinite(timestamp)) {
                        return "";
                      }

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
        </CardContent>
      </Card>
    </div>
  );
}