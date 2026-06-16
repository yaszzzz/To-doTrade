import Link from "next/link";
import Image from "next/image";
import { getPublicBacktestStrategies } from "@/lib/actions/public.actions";
import { calculatePublicBacktestStats } from "@/lib/public-stats";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type PublicBacktestsPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function PublicBacktestsPage({
  searchParams,
}: PublicBacktestsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const strategies = await getPublicBacktestStrategies({ search });

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <PublicNav />

      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-blue-200 bg-blue-50 text-blue-700 font-bold">
              PUBLIC BACKTEST DATA
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl">
              Validasi strategi trading
            </h1>
            <p className="max-w-2xl text-lg text-[#64748B]">
              Ringkasan backtest read-only untuk membantu publik melihat performa
              setup dan sample trade tanpa mengakses dashboard internal.
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="border-[#E2E8F0] hover:bg-[#F8FAFC] font-bold">
            <Link href="/public/signals">
              Lihat Signals
            </Link>
          </Button>
        </div>

        {/* Search Form */}
        <Card className="border-[#E2E8F0] shadow-lg mb-8">
          <CardContent className="pt-6">
            <form className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-semibold text-[#1E293B]">
                  Search strategy / market / timeframe
                </Label>
                <Input
                  id="search"
                  name="search"
                  defaultValue={search}
                  placeholder="SMC, BTC, 1H..."
                  className="h-11 border-[#E2E8F0] focus-visible:ring-[#1E4ED8]"
                />
              </div>
              <Button type="submit" size="lg" className="bg-[#1E293B] hover:bg-[#0F172A] font-bold">
                Filter
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Strategies Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {strategies.length > 0 ? (
            strategies.map((strategy) => {
              const stats = calculatePublicBacktestStats(strategy.backtestTrades);

              return (
                <Link key={strategy.id} href={`/public/backtests/${strategy.id}`}>
                  <Card className="group h-full border-[#E2E8F0] hover:border-[#1E4ED8]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs font-bold text-[#1E4ED8] bg-blue-50">
                            {strategy.market}
                          </Badge>
                          <span className="h-1 w-1 rounded-full bg-[#E2E8F0]"></span>
                          <Badge variant="secondary" className="text-xs font-bold text-[#1E4ED8] bg-blue-50">
                            {strategy.timeframe}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs font-bold text-[#64748B] border-[#E2E8F0]">
                          {strategy.rrTarget}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-extrabold text-[#1E293B] group-hover:text-[#1E4ED8] transition-colors">
                        {strategy.strategyName}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-base leading-relaxed">
                        {strategy.description || "Belum ada deskripsi strategi."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Separator className="mb-6 bg-[#E2E8F0]" />
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <Metric label="Trades" value={stats.totalTrades.toString()} />
                        <Metric 
                          label="Win Rate" 
                          value={`${stats.winRate.toFixed(1)}%`} 
                          highlight={stats.winRate >= 50} 
                        />
                        <Metric label="Avg RR" value={`${stats.averageRR.toFixed(2)}R`} />
                      </div>
                      <p className="text-xs font-medium text-[#64748B]">
                        Updated {formatDate(strategy.updatedAt)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <Card className="border-dashed border-[#E2E8F0] bg-white md:col-span-2 xl:col-span-3">
              <CardContent className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-6xl">📭</div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#1E293B]">Belum ada backtest</h3>
                    <p className="text-[#64748B]">Belum ada backtest yang cocok dengan filter.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}

function PublicNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Image
            src="/logo.webp"
            alt="AxellTrade Logo"
            width={40} 
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-[#1E293B]">AxellTrade</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/public/signals" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">
            Signals
          </Link>
          <Link href="/public/backtests" className="text-sm font-bold text-[#1E4ED8]">
            Backtests
          </Link>
          <Button asChild size="default" className="bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-semibold shadow-md">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">{label}</p>
      <p className={`text-lg font-extrabold ${highlight ? 'text-[#10B981]' : 'text-[#1E293B]'}`}>
        {value}
      </p>
    </div>
  );
}