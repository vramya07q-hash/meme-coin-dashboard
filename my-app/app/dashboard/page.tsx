"use client";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Amphora, ArrowLeftRight, CircleCheck, CircleX, Droplet, ReceiptText, TriangleAlert, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  interface TotalValuesType {
    totalMarketCap: number;
    total24hVolume: number;
    trendingCoinsCount: number;
    top5Dominance: number;
    totalChange24h:number;
  }

  const [coins, setCoins] = useState<any[]>([]);
  const [volume, setVolume] = useState<any[]>([]);
  const [totalValues, setTotalValues] = useState<TotalValuesType>({
    totalMarketCap: 0,
    total24hVolume: 0,
    trendingCoinsCount: 0,
    top5Dominance: 0,
    totalChange24h:0
  });

  async function getCoins() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/coins/trending-coins"
      );

      const coins = response.data;

      setCoins(coins);

      return coins;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async function getCoinsByVolume() {
    try {
      const response = await axios.get('http://localhost:3000/api/coins/trending-by-volume');

      const result = response.data;
      setVolume(result);

      return result;

    } catch (error: any) {
      console.log(error.message);
    }
  }

  async function getTotalvalues() {
    try {
      const response = await axios.get('http://localhost:3000/api/coins/totalValues');

      const result = response.data;
      setTotalValues(result);
      return result;
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getCoins();
    getCoinsByVolume();
    getTotalvalues();
  }, []);

  return (
    <div className='w-full min-h-screen bg-gray-900 '>
      {/* navbar */}
      <Navbar />
      <div className='w-full h-auto flex lg:gap-2 justify-between' >
        {/* large first card */}
        <div className='hidden lg:block w-1/2 h-auto  flex flex-col text-gray-200 items-center pl-4'>

          <div className='w-full h-auto flex flex-col gap-4 mt-8 md:mt-5 pb-4  '>
            {/* trending coin */}
            <div>
              <h1 className='text-2xl  '>Trending Meme Coins</h1>
              <p className='text-sm font-light text-gray-300'>Top meme coins based on 24h market activity</p>
            </div>

            {/* four  linear cards*/}
            <div className='w-full flex gap-3'>
              <FourCard
                image="/marketCap.jpg"
                name="Total Market Cap"
                totalAmount={Number(totalValues.totalMarketCap.toFixed(2))}
                change24h={Number(totalValues.totalChange24h.toFixed(2))}
              />

              <FourCard
                image="/speaker.jpg"
                name="Total 24h Volume"
                totalAmount={Number(totalValues.total24hVolume.toFixed(2))}
                change24h={5.42}
              />

              <FourCard
                image="/star.jpg"
                name="Trending Coins"
                totalAmount={totalValues.trendingCoinsCount}
                change24h={5.42}
              />

              <FourCard
                image="/dominance.jpg"
                name="Dominance"
                totalAmount={Number(totalValues.top5Dominance.toFixed(2))}
                change24h={5.42}
              />
            </div>
          </div>

        </div>
        {/* Larger second part */}
        <div className="w-full lg:w-1/2  h-auto bg-gray-900 flex flex-col gap-1 md:gap-0  items-center ">
          <div className="w-[95%] h-auto flex flex-col gap-4 mt-8 md:mt-5 pb-4  ">

            {/* first card */}
            <div className="  flex flex-col  bg-gray-800 gap-1 rounded-lg h-auto lg:border lg:border-gray-600">
              <div className="h-1/6 w-full  flex gap-4 items-center  p-2 rounded-lg">
                <img
                  src={coins[0]?.image}
                  alt="coin image"
                  className="w-auto h-[40px]  rounded-full"
                />
                <div className="text-white">
                  <p className="text-lg font-semibold">
                    {coins[0]?.name} ({coins[0]?.symbol.toUpperCase()})
                  </p>
                  <div className="text-white flex gap-4">
                    <p className="text-xl">${coins[0]?.price}</p>
                    <p
                      className={`text-sm font-normal flex items-center gap-5 ${coins[0]?.change24h < 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {coins[0]?.change24h.toFixed(2)}(24h)
                    </p>
                  </div>
                </div>
              </div>

              {/*days */}
              <div className="w-full h-1/10 bg-gray-700 grid grid-cols-5  rounded-lg text-white  font-normal text-sm ">
                <p className="hover:cursor-pointer text-center hover:bg-indigo-900 rounded-md  hover:border hover:border-gray-600 py-2  ">
                  7D
                </p>
                <p className="hover:cursor-pointer text-center hover:bg-indigo-900 rounded-md  hover:border hover:border-gray-600 py-2">
                  1M
                </p>
                <p className="hover:cursor-pointer text-center hover:bg-indigo-900 rounded-md  hover:border hover:border-gray-600 py-2">
                  3M
                </p>
                <p className="hover:cursor-pointer text-center hover:bg-indigo-900 rounded-md  hover:border hover:border-gray-600 py-2">
                  1Y
                </p>
                <p className="hover:cursor-pointer text-center hover:bg-indigo-900 rounded-md  hover:border hover:border-gray-600 py-2">
                  ALL
                </p>
              </div>

              {/* Chart */}
              <div className=" h-full w-full flex gap-2 flex-col items-center ">
                <div className="h-[130px] lg:h-[250px] lg:border border-indigo-900 w-7/8 bg-pink-200"></div>

                <div className="grid grid-cols-2 h-2/5 w-11/12 text-sm font-light mb-2 text-gray-400 lg:flex lg:flex-col  lg:mt-3">
                  <div className="border border-gray-600 w-full rounded-l-md  pl-2  pr-2 flex flex-col justify-center   lg:border-none">
                    <div className="flex justify-between  lg:h-8 lg:border-t-1 lg:border-gray-600 lg:border-opacity-0 lg:items-center">
                      <p>Market Cap</p>
                      <p className="text-gray-200">${coins[0]?.marketCap}</p>
                    </div>
                    <div className="flex justify-between lg:h-8 lg:border-t-1 lg:border-gray-600 lg:items-center">
                      <p>24h Volume</p>
                      <p className="text-gray-200">${coins[0]?.volume24h}</p>
                    </div>
                    <div className="flex justify-between lg:h-8 lg:border-t-1 lg:border-gray-600 lg:items-center">
                      <p>24h High</p>
                      <p className="text-gray-200">
                        ${coins[0]?.high24h.toFixed(3)}
                      </p>
                    </div>
                    <div className="flex justify-between lg:h-8 lg:border-t-1 lg:border-gray-600 lg:items-center">
                      <p>24h Low </p>
                      <p className="text-gray-200">
                        ${coins[0]?.low24h.toFixed(3)}
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-600 w-full rounded-r-md pl-2 pr-2 grid-rows-4 flex flex-col justify-center lg:border-none">
                    <div className="flex justify-between items-center mb-0 lg:border-t-1 lg:border-gray-600 lg:h-8">
                      <p>Total Supply</p>
                      <p className="text-gray-200">${coins[0]?.marketCap}</p>
                    </div>
                    <div className="flex justify-between  lg:border-t-1 lg:border-gray-600 lg:h-8 lg:items-center">
                      <p>Circulatary Supply</p>
                      <p className="text-gray-200">${coins[0]?.volume24h}</p>
                    </div>
                    <div className="flex justify-between   lg:border-t-1 lg:border-gray-600 lg:h-8 lg:items-center">
                      <p>Blockchain</p>
                      <p className="text-gray-200">
                        ${coins[0]?.high24h.toFixed(3)}
                      </p>
                    </div>
                    <div className="flex justify-between lg:border-t-1 lg:border-gray-600 lg:h-8 lg:items-center">
                      <p>Contract Address</p>
                      <p className="text-gray-200 ">
                        ${coins[0]?.low24h.toFixed(3)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* second card */}
            <div className="lg:hidden row-span-3 border border-indigo-900   text-white h-full bg-gray-800 pt-1 pl-3 rounded-lg flex flex-col">
              <p className="text-lg font-bold">Top Trending Meme Coins</p>
              <div className="h-10/5 w-full overflow-x-auto overflow-y-auto mt-2">
                <Table className="row-span-4  w-full overflow-auto">
                  <TableHeader className="text-white">
                    <TableRow className="bg-gary-700 border border-indigo-900 ">
                      <TableHead className="text-white">#</TableHead>
                      <TableHead className="text-white">Coin</TableHead>
                      <TableHead className="text-white">Price</TableHead>
                      <TableHead className="text-white">24h Change</TableHead>
                      <TableHead className="text-white">Market Cap</TableHead>
                      <TableHead className="text-white">Chart</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow className="hover:bg-gray-600 ">
                      <TableCell>1</TableCell>
                      <TableCell>{coins[0]?.name}</TableCell>
                      <TableCell>${coins[0]?.price.toFixed(4)}</TableCell>
                      <TableCell
                        className={
                          coins[0]?.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {coins[0]?.change24h.toFixed(2)}%
                      </TableCell>
                      <TableCell>${coins[0]?.marketCap}</TableCell>
                      <TableCell>Chart</TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-gray-600">
                      <TableCell>2</TableCell>
                      <TableCell>{coins[1]?.name}</TableCell>
                      <TableCell>${coins[1]?.price.toFixed(4)}</TableCell>
                      <TableCell
                        className={
                          coins[1]?.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {coins[1]?.change24h.toFixed(2)}%
                      </TableCell>
                      <TableCell>${coins[1]?.marketCap}</TableCell>
                      <TableCell>Chart</TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-gray-600">
                      <TableCell>3</TableCell>
                      <TableCell>{coins[2]?.name}</TableCell>
                      <TableCell>${coins[2]?.price.toFixed(4)}</TableCell>
                      <TableCell
                        className={
                          coins[2]?.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {coins[2]?.change24h.toFixed(2)}%
                      </TableCell>
                      <TableCell>${coins[2]?.marketCap}</TableCell>
                      <TableCell>Chart</TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-gray-600">
                      <TableCell>4</TableCell>
                      <TableCell>{coins[3]?.name}</TableCell>
                      <TableCell>${coins[3]?.price.toFixed(4)}</TableCell>
                      <TableCell
                        className={
                          coins[3]?.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {coins[3]?.change24h.toFixed(2)}%
                      </TableCell>
                      <TableCell>${coins[3]?.marketCap}</TableCell>
                      <TableCell>Chart</TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-gray-600">
                      <TableCell>5</TableCell>
                      <TableCell>{coins[4]?.name}</TableCell>
                      <TableCell>${coins[4]?.price.toFixed(4)}</TableCell>
                      <TableCell
                        className={
                          coins[4]?.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {coins[4]?.change24h.toFixed(2)}%
                      </TableCell>
                      <TableCell>${coins[4]?.marketCap}</TableCell>
                      <TableCell>Chart</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="lg:hidden row-span-3 h-full text-white pl-2 pt-1 bg-gray-800 rounded-lg flex flex-col items-start">
              <p className="text-lg font-semibold">Trending by 24h Volume</p>

              <div className=" h-5/6 w-[95%] flex flex-col mt-4">
                {volume.map((coin: any, index: number) => (
                  <div
                    key={coin.id}
                    className="w-full flex items-center justify-between p-2 border-t border-gray-700"
                  >

                    <div className="flex items-center  gap-6">
                      <p>{coin.index + 1}</p>

                      <div className="flex items-center gap-1">
                        <img src={coin.image} alt="profile image" className="h-6" />
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-gray-400">
                          ({coin.symbol.toUpperCase()})
                        </p>
                      </div>
                    </div>

                    <div className="w-[30%] h-2 border border-white rounded-lg">
                      <div
                        className="h-full bg-blue-500 rounded-lg"
                        style={{
                          width: `${(coin.volume24h / 100000000000) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <p>${coin.volume24h}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Large Screen Second Card */}

          <div className='hidden lg:block w-[95%] bg-gray-800 flex felx-col text-gray-400 border border-gray-600 rounded-md '>
            <div className='flex flex-col gap-2 mb-6 '>
              <div className='text-white text-lg flex ml-5 '>
                <p>Risk & Security </p>
              </div>

              <div className='flex justify-between ml-5 mr-45'>

                <div className='flex gap-3'>
                  <ReceiptText />
                  <p>Contract Voil</p>
                </div>

                <CircleCheck fill='green' />
              </div>

              <div className='flex justify-between ml-5 mr-45'>
                <div className='flex gap-3'>
                  <UsersRound />
                  <p>Holders</p>
                </div>
                <CircleCheck fill='green' />
              </div>

              <div className='flex justify-between ml-5 mr-45'>
                <div className='flex gap-3'>
                  <ArrowLeftRight />
                  <p>Transactions</p>
                </div>
                <CircleX fill='red' />
              </div>

              <div className='flex justify-between ml-5 mr-45'>
                <div className='flex gap-3'>
                  <Amphora />
                  <p>Honeypot detected</p>
                </div>
                <CircleX fill='red' />
              </div>

              <div className='flex justify-between ml-5 mr-45'>
                <div className='flex gap-3'>
                  <Droplet />
                  <p>Top holder concenration</p>
                </div>
                <TriangleAlert fill='orange' />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

interface FourCardsType {
  image: string;
  name: string;
  totalAmount: number;
  change24h: number;
}

function FourCard({
  image,
  name,
  totalAmount,
  change24h
}: FourCardsType) {
  return (
    <Card className='bg-gray-800 border border-gray-600 text-white w-full flex flex-row '>
      <div className='rounded-full pl-3'>
        <img src={image} alt="img" className='rounded-full w-9 h-9' />
      </div>
      <div className='flex flex-col gap-2'>
        <p className='text-md text-gray-200'>{name}</p>
        <p className='text-xl font-bold'>${totalAmount} B</p>
        <p className={`${change24h < 0 ? "text-red-500" : "text-green-500"}`}>{change24h}%(24h)</p>
      </div>
    </Card>
  );
}