'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import axios from "axios";
import { Info } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function inputHander(e: React.ChangeEvent<HTMLInputElement>) {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSignin() {
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:3000/api/login",
        value,
      );
      const token = response.data.token;

      localStorage.setItem("signupToken:", token);
    } catch (error: any) {
      setError(error.response?.data.message);
      console.log(error);
    }
  }

  function handleSignupRouter() {
    router.push("/signup");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <Card className="w-full max-w-md border border-white/10 bg-white/95 shadow-2xl rounded-2xl">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-3xl font-bold `pb-1` tracking-tight text-slate-900">
            Login Account
          </CardTitle>

          <p className="text-sm text-slate-500">
            Welcome back!Please enter your details
          </p>
          <p className="text-sm text-slate-500 "> to continue</p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <Input
                name="email"
                value={value.email}
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-lg"
                onChange={inputHander}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <span className="text-xs text-slate-400">
                  Min. 8 characters
                </span>
              </div>

              <Input
                name="password"
                value={value.password}
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-lg"
                onChange={inputHander}
              />

              <p
                className={` text-red-600 ${error ? "block" : "hidden"} flex  items-center gap-2`}
              >
                <Info size={18} />
                <span>{error}</span>
              </p>
            </div>

            <Button
              className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
              onClick={handleSignin}
            >
              Login Account
            </Button>

            {/* Login */}
            <p className="text-center text-sm text-slate-500">
              Want to create an account?{" "}
              <span
                className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700"
                onClick={handleSignupRouter}
              >
                Sign in
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}