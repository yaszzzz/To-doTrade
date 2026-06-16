import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicVideoBackground } from "@/components/public/public-video-background";
import { PublicNav } from "@/components/public/public-nav";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <div className="bg-background relative min-h-screen overflow-visible lg:overflow-hidden">
        <div className="flex flex-col min-h-screen relative pt-32 pb-12 sm:py-32 md:pt-24 lg:pt-0 overflow-hidden">
          
        
          {/* Navigation */}
          <div className="relative z-20">
            <PublicNav />
          </div>

          {/* Header Content - Centered */}
          <div className="flex-1 lg:flex-none flex flex-col justify-center md:justify-start md:pt-16 lg:pt-48 items-center space-y-8 lg:space-y-0 z-20 px-3 sm:px-4 lg:px-0 lg:max-w-[1400px] lg:mx-auto lg:w-full lg:mb-12 xl:mb-12 2xl:mb-12 3xl:mb-16">
            <div className="flex flex-col items-center w-full text-center space-y-6 lg:space-y-8">
              <div className="space-y-5 lg:space-y-6 max-w-3xl 3xl:max-w-5xl mx-auto px-2 lg:px-0">
                {/* Badge/Announcement */}
                <Link
                  href="/public/signals"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border text-xs font-sans text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  View Public Signals
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                {/* Main Headline */}
                <h1 className="font-serif text-3xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-7xl 3xl:text-8xl leading-[1.1] tracking-tight text-foreground">
                  Track your trading journey{" "}
                  <em className="not-italic text-muted-foreground/80">
                    with confidence
                  </em>
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground text-base lg:text-lg leading-relaxed font-sans max-w-xl mx-auto">
                  Manage signals, backtest strategies, keep a journal, and analyze your performance. 
                  All in one place.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <Button
                  asChild
                  className="h-11 px-6 transition-colors"
                  size="lg"
                >
                  <Link href="/login">
                    <span className="text-inherit text-sm">
                      Start your trial
                    </span>
                  </Link>
                </Button>

                <p className="text-muted-foreground text-xs font-sans">
                  Free to start · No credit card required
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="mt-8 mb-8 md:mt-12 lg:mt-0 lg:mb-4 3xl:mb-20 h-20" />
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-background py-20 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional tools for serious traders
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 - Signals */}
            <div className="border border-border p-8 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-2xl">
                📊
              </div>
              <h3 className="font-serif text-xl text-foreground">Trading Signals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share and track your trading signals with complete transparency. Monitor performance in real-time.
              </p>
              <Link
                href="/public/signals"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View Signals
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {/* Feature 2 - Backtests */}
            <div className="border border-border p-8 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-2xl">
                📈
              </div>
              <h3 className="font-serif text-xl text-foreground">Strategy Backtesting</h3>
              <p className="text-muted-foreground leading-relaxed">
                Validate your strategies with detailed backtest data. See what works before you trade.
              </p>
              <Link
                href="/public/backtests"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View Backtests
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {/* Feature 3 - Journal */}
            <div className="border border-border p-8 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-2xl">
                📝
              </div>
              <h3 className="font-serif text-xl text-foreground">Trading Journal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Document every trade with screenshots, notes, and tags. Learn from your history.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                Coming soon
              </div>
            </div>

            {/* Feature 4 - Analytics */}
            <div className="border border-border p-8 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-2xl">
                📉
              </div>
              <h3 className="font-serif text-xl text-foreground">Advanced Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deep insights into your trading performance with comprehensive metrics and charts.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                Dashboard feature
              </div>
            </div>

            {/* Feature 5 - Portfolio */}
            <div className="border border-border p-8 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-2xl">
                💼
              </div>
              <h3 className="font-serif text-xl text-foreground">Portfolio Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor your capital allocation and track returns across multiple strategies.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                Dashboard feature
              </div>
            </div>

            {/* Feature 6 - Risk Management */}
            <div className="border border-border p-8 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-2xl">
                🎯
              </div>
              <h3 className="font-serif text-xl text-foreground">Risk Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Calculate position sizes, track risk-reward ratios, and maintain discipline.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                Built-in tools
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background border-t border-border py-20 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground">
              Ready to level up your trading?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join traders who are serious about improving their performance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="text-base font-semibold px-8">
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base font-semibold px-8">
                <Link href="/public/signals">Explore Public Data</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 ToDoTrade. Built for traders.
            </p>
            <div className="flex gap-6">
              <Link href="/public/signals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Signals
              </Link>
              <Link href="/public/backtests" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Backtests
              </Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}