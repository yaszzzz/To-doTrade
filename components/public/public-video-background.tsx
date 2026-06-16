"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function PublicVideoBackground() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    const handleCanPlayThrough = () => {
      setIsVideoLoaded(true);
    };

    // Check if video is already loaded
    if (video.readyState >= 3) {
      setIsVideoLoaded(true);
    }

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden m-2">
      {/* Poster image with blur effect */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
          isVideoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          filter: isVideoLoaded ? "blur(0px)" : "blur(1px)",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-background to-emerald-500/20" />
      </div>

      {/* Animated gradient background as fallback */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1E4ED8]/10 via-background to-[#10B981]/10 animate-gradient" />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col justify-center items-center p-8 text-center h-full w-full">
        <div className="max-w-lg space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground lg:text-white">
              Transparansi Trading
            </h2>
            <p className="text-lg text-muted-foreground lg:text-white/80">
              Lihat signal aktif, hasil tracking real-time, dan validasi strategi berbasis data backtest.
            </p>
          </div>
          
          <div className="grid gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-foreground lg:text-white">Real-time Signal Tracking</p>
                <p className="text-sm text-muted-foreground lg:text-white/70">Track every signal from entry to exit</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-foreground lg:text-white">Validated Strategies</p>
                <p className="text-sm text-muted-foreground lg:text-white/70">Backtest results with sample trades</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-foreground lg:text-white">Performance Metrics</p>
                <p className="text-sm text-muted-foreground lg:text-white/70">Win rate, RR, and detailed statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}