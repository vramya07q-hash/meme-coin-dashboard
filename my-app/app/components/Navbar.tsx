'use client'

import Image from 'next/image'
import logo from '../../public/logo.jpg'
import { Input } from '@/components/ui/input'
import { Moon, Search ,Sidebar} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
export const items=[
  {
    title:"Trending",
    url:"/trending"
  },
  {
    title:"All Meme Coins",
    url:"/all-meme-coins"
  },
  {
    title:"Watchlist",  
    url:"/watchlist"
  },
  {
    title:"Protfolio",
    url:"/portfolio"
  },{
    title:"Settings",
    url:"/settings"
  }

]

export default function Navbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm,setSearchTerm] = useState<string>("");
  const [searchResults,setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if(searchTerm.trim() !== "") {
        searchCoins(searchTerm);
      }
    },500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  async function searchCoins(searchTerm:string) {
    try {
      setSearchResults([]);

      const response = await axios.get(
        `http://localhost:3000/api/coins/search-coins?search=${searchTerm}`,
      );

      setSearchResults(response.data);
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  function handleResultClick(name:string) {
    setSearchTerm(name);
    setSearchResults([]);
    console.log("Clicked on:", name);
  }

  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleSearch = async(e:React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  }

  return (
    <div className="w-full h-[60px] flex flex-col gap-2 items-center" onClick={() => setSearchTerm("")} >
      <div className="w-full h-[60px] flex items-center justify-between bg-gray-800 px-2">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <Image
            src={logo}
            alt="pepe image"
            className="object-contain rounded-full w-11 h-11"
          />

          <div className="flex flex-col">
            <p className="text-lg text-white">
              MemeCoin <span className="text-green-500">Tracker</span>
            </p>

            <p className="text-gray-400 text-xs">
              Trending Meme Coins-24h Market
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="relative w-1/2 hidden md:block" ref={inputRef}>
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2"
          >
            <Search color="white" size={18} />
          </button>

          <Input
            type="text"
            
            value={searchTerm}
            placeholder="Search Meme Coins"
            onChange={handleSearch}
            className="w-full bg-gray-800  text-white rounded-lg border-gray-500 focus:border-blue-500 focus:ring-blue-500 pl-10"
          />

          <div
          
            className={`w-full absolute top-[100%] h-auto left-0 bg-gray-800 rounded-lg border border-gray-500 mt-1 z-10 ${
              searchResults.length === 0 || searchTerm.trim() === ""
                ? "hidden"
                : "block"
            }
            
            `}
          >
            {searchTerm.trim() !== "" && (
              <ul className="flex flex-col gap-1 p-2">
                <li className="text-gray-400 text-sm">Search Results</li>

                {searchResults.map((result: any) => (
                  <li
                    key={result.id}
                    className="text-white text-sm cursor-pointer hover:bg-gray-700 p-1 rounded-md"
                    onClick={() => handleResultClick(result.name)}
                  >
                    {result.name} ({result.symbol.toUpperCase()})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-1">
          <div className="h-[30px] w-10 border border-gray-500 rounded-lg flex justify-center items-center bg-gray-800">
            <Moon color="white" size={20} />
          </div>

          <div className="h-[30px] w-10 border border-gray-500 rounded-lg flex justify-center items-center bg-gray-800">
            <Sidebar color="white" size={20} />
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="relative flex justify-center w-10/12  md:hidden h-[45px] ">
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2"
        >
          <Search color="white" size={18} />
        </button>

        <Input
          type="text"
          placeholder="Search Meme Coins"
          className="w-full bg-gray-800 text-sm h-[38px] font-light  text-white rounded-lg border-gray-500 focus:border-blue-500 focus:ring-blue-500 pl-10"
        />
      </div>
    </div>
  );
}