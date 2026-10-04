'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { CircleCheck, Info } from "lucide-react";

export default function SignUp() {
      const [value,setValue] = useState({
        fname:"",
        lname:"",
        email:"",
        password:""
      });

      const [error,setError]=useState("");
      const [message,setMessage]=useState("");

      function inputHander(e:React.ChangeEvent<HTMLInputElement>) {
        setValue((prev) => ({
          ...prev,
          [e.target.name]:e.target.value
        }))
      }
      
      async function handleSignup() {
        try{
          setError("");
          const response =await axios.post('http://localhost:3000/api/signup',value);
          const token = response.data.token;
          localStorage.setItem("signupToken:",token);
          setMessage(response.data.message);

        } catch(error:any) {
          setMessage("");
          setError(error.response?.data.message);
        }
      }

      const router = useRouter();
  
      function handleSignupRouter () {
          router.push('/signin')
      }
      
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <Card className="w-full max-w-md border border-white/10 bg-white/95 shadow-2xl rounded-2xl">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-lg">
            S
          </div>

          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Create Account
          </CardTitle>

          <p className="text-sm text-slate-500 ">
            Create your account to get started
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8 mt-3">
          <div className={`space-y-5`}>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  First name
                </label>

                <Input
                  name="fname"
                  value={value.fname}
                  type="text"
                  placeholder="John"
                  className="h-11 rounded-lg"
                  onChange={inputHander}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Last name
                </label>

                <Input
                  name="lname"
                  value={value.lname}
                  type="text"
                  placeholder="Doe"
                  className="h-11 rounded-lg"
                  onChange={inputHander}
                />
              </div>
            </div>

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
              <p className={` text-red-600 ${error ? "block" : "hidden"} flex  items-center gap-2`}>
                <Info size={18}/>
                <span>{error}</span>
              </p>
              <p
                className={`text-green-600 ${message ? "block" : "hidden"} flex items-center gap-2`}
              >
                <CircleCheck size={18} />
                <span>{message}</span>
              </p>{" "}
            </div>

            <Button
              className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
              onClick={handleSignup}
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
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