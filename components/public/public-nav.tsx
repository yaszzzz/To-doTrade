import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="relative py-4 px-6 lg:px-8 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50">
        {/* Logo - Left */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
        >
          <div className="w-6 h-6">
           <Image src="/Image/logo.webp" alt="Axell Trade Logo" width={24} height={24} />
          </div>
          <span className="text-base font-medium">Axell Trade</span>
        </Link>

        {/* Navigation Links - Center */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/public/signals"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Signals
          </Link>
          <Link
            href="/public/backtests"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Backtests
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
        </div>

        {/* Sign In - Right */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}