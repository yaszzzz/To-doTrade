"use client";

import { useState } from "react";
import { registerUser } from "@/lib/actions/auth.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="AxellTrade Logo" 
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold text-[#1E293B]">AxellTrade</span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
              Create Account
            </h1>
            <p className="text-[#64748B]">
              Start your trading journey with AxellTrade
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-xl">
              <p className="text-sm text-[#EF4444] font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={loading}
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                disabled={loading}
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-[#64748B]">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                disabled={loading}
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748B]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#64748B] hover:text-[#1E293B] font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}