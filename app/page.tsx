import Link from "next/link";
import Image from "next/image";
import {
  getPublicBacktestStrategies,
  getPublicSignalStats,
  getPublicSignals,
} from "@/lib/actions/public.actions";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const statusLabels = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
} as const;

const statusClasses = {
  running: "bg-blue-50 text-[#1E4ED8] border border-[#1E4ED8]/20",
  hit_tp: "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20",
  hit_sl: "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20",
  cancelled: "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]",
} as const;

export default async function HomePage() {
  const [signals, stats, strategies] = await Promise.all([
    getPublicSignals(),
    getPublicSignalStats(),
    getPublicBacktestStrategies(),
  ]);

  const latestSignals = signals.slice(0, 4);
  const latestStrategies = strategies.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Header / Navigation */}
      <header className="sticky top-0 left-0 right-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <nav className="flex h-[72px] items-center justify-between">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <Image 
                src="/logo.webp" 
                alt="AxellTrade Logo" 
                width={40}
                height={40}
                priority
                unoptimized
                className="h-10 w-10"
              />
              <span className="text-xl font-bold tracking-tight text-[#1E293B]">AxellTrade</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/public/signals"
                className="hidden text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors sm:inline"
              >
                Public Signals
              </Link>
              <Link
                href="/public/backtests"
                className="hidden text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors sm:inline"
              >
                Backtest Data
              </Link>
              <Button asChild size="default" className="bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-semibold shadow-md">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,78,216,0.05),transparent_50%)]" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-16 lg:px-8 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[1fr_420px] lg:items-start">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8">
              <Badge variant="outline" className="w-fit border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-50 backdrop-blur-sm px-4 py-2">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                </span>
                Trading journal, signals, backtest, dan portfolio tracker
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                  Transparansi signal trading{" "}
                  <span className="text-[#1E4ED8]">dan validasi strategi</span>{" "}
                  berbasis data
                </h1>
                <p className="text-lg leading-relaxed text-[#64748B] max-w-2xl">
                  Lihat signal aktif, hasil signal sebelumnya, dan statistik backtest strategi tanpa perlu login.
                  Area dashboard tetap aman untuk admin/user terdaftar.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold shadow-lg hover:shadow-xl transition-all">
                  <Link href="/public/signals">
                    Lihat Signal Public
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#E2E8F0] hover:bg-[#F8FAFC] font-bold">
                  <Link href="/public/backtests">
                    Lihat Backtest
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Photo & Stats */}
            <div className="relative z-10 flex flex-col gap-6">
              {/* Photo Card */}
              <Card className="group overflow-hidden border-[#E2E8F0] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F8FAFC]">
                    <Image
                      src="/fotosaya.webp"
                      alt="Axell - AxellTrade Founder"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                      unoptimized
                    />
                  </div>
                  <div className="mt-4 px-2 pb-2">
                    <h3 className="text-xl font-bold text-[#1E293B]">Axell</h3>
                    <p className="text-sm font-medium text-[#64748B]">Founder & Trader</p>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="border-[#E2E8F0] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#64748B]">
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <StatMetric label="Total Signals" value={stats.totalSignals.toString()} />
                    <StatMetric label="Running" value={stats.runningSignals.toString()} />
                    <StatMetric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} color="profit" />
                    <StatMetric label="Avg RR" value={`${stats.averageRR.toFixed(2)}R`} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Signals Section */}
      <section className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-8 lg:py-28">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-[#1E293B] lg:text-4xl">Latest Signals</h2>
              <p className="text-lg text-[#64748B]">
                Signal trading terbaru dengan tracking hasil real-time
              </p>
            </div>
            <Button asChild variant="ghost" className="group text-[#1E4ED8] hover:text-[#1D4ED8] font-bold">
              <Link href="/public/signals">
                View all signals
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {latestSignals.length > 0 ? (
              latestSignals.map((signal) => (
                <Link key={signal.id} href={`/public/signals/${signal.id}`}>
                  <Card className="group h-full border-[#E2E8F0] hover:border-[#1E4ED8]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl font-bold text-[#1E293B] group-hover:text-[#1E4ED8] transition-colors">
                          {signal.pair}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase ${statusClasses[signal.status]}`}
                        >
                          {statusLabels[signal.status]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Entry Price</span>
                        <span className="font-bold text-[#1E293B]">{signal.entry}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Risk Reward</span>
                        <span className="font-bold text-[#1E293B]">{signal.riskReward}:1</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="border-dashed border-[#E2E8F0] bg-[#F8FAFC] md:col-span-2 lg:col-span-4">
                <CardContent className="py-16 text-center">
                  <p className="font-medium text-[#64748B]">Belum ada signal public.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Backtest Section */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-8 lg:py-28">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-[#1E293B] lg:text-4xl">Backtest Strategies</h2>
              <p className="text-lg text-[#64748B]">
                Ringkasan strategi yang sudah diuji dengan sample trade
              </p>
            </div>
            <Button asChild variant="ghost" className="group text-[#1E4ED8] hover:text-[#1D4ED8] font-bold">
              <Link href="/public/backtests">
                View all strategies
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestStrategies.length > 0 ? (
              latestStrategies.map((strategy) => {
                const totalTrades = strategy.backtestTrades.length;
                const wins = strategy.backtestTrades.filter((trade) => trade.result === "win").length;
                const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

                return (
                  <Link key={strategy.id} href={`/public/backtests/${strategy.id}`}>
                    <Card className="group h-full border-[#E2E8F0] hover:border-[#1E4ED8]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <CardHeader className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-bold text-[#1E4ED8] bg-blue-50">
                            {strategy.market}
                          </Badge>
                          <span className="h-1 w-1 rounded-full bg-[#E2E8F0]"></span>
                          <Badge variant="secondary" className="text-xs font-bold text-[#1E4ED8] bg-blue-50">
                            {strategy.timeframe}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold text-[#1E293B] group-hover:text-[#1E4ED8] transition-colors">
                          {strategy.strategyName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base leading-relaxed">
                          {strategy.description || "Belum ada deskripsi strategi."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Separator className="mb-6 bg-[#E2E8F0]" />
                        <div className="grid grid-cols-3 gap-4">
                          <MetricMini label="Trades" value={totalTrades.toString()} />
                          <MetricMini label="Win Rate" value={`${winRate.toFixed(0)}%`} />
                          <MetricMini label="RR Target" value={strategy.rrTarget} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <Card className="border-dashed border-[#E2E8F0] bg-white md:col-span-2 lg:col-span-3">
                <CardContent className="py-16 text-center">
                  <p className="font-medium text-[#64748B]">Belum ada data backtest public.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} AxellTrade. Data-driven trading workflow.</p>
            <p>Last updated: {formatDate(new Date())}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatMetric({ label, value, color }: { label: string; value: string; color?: 'profit' | 'loss' }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all hover:bg-white hover:shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{label}</p>
      <p className={`mt-2 text-xl font-black ${
        color === 'profit' ? 'text-[#10B981]' : 
        color === 'loss' ? 'text-[#EF4444]' : 
        'text-[#1E293B]'
      }`}>
        {value}
      </p>
    </div>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#1E293B]">{value}</p>
    </div>
  );
}