"use client";

import { useState } from "react";
import { loginUser, loginWithGoogle } from "@/lib/actions/auth.actions";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    await loginWithGoogle();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,78,216,0.03),transparent_50%)]" />
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 transition-opacity hover:opacity-90">
            <Image 
              src="/logo.webp"
              alt="AxellTrade Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold text-[#1E293B]">AxellTrade</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-[#E2E8F0] shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-extrabold text-[#1E293B]">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your AxellTrade account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-xl">
                <p className="text-sm text-[#EF4444] font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#1E293B]">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={loading}
                  className="h-12 border-[#E2E8F0] focus-visible:ring-[#1E4ED8]"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-[#1E293B]">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={loading}
                  className="h-12 border-[#E2E8F0] focus-visible:ring-[#1E4ED8]"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-[#64748B] font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full h-12 border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] font-bold"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-[#64748B]">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Button asChild variant="ghost" className="text-[#64748B] hover:text-[#1E293B] font-medium">
            <Link href="/">
              ← Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}