import Link from "next/link";
import {
  getPublicBacktestStrategies,
  getPublicSignalStats,
  getPublicSignals,
} from "@/lib/actions/public.actions";
import { formatDate } from "@/lib/utils";

const statusLabels = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
} as const;

const statusClasses = {
  running: "bg-blue-100 text-blue-700",
  hit_tp: "bg-green-100 text-green-700",
  hit_sl: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-700",
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
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb55,transparent_35%),radial-gradient(circle_at_top_right,#22c55e33,transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              ToDoTrade
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/public/signals"
                className="hidden text-sm text-slate-300 hover:text-white sm:inline"
              >
                Public Signals
              </Link>
              <Link
                href="/public/backtests"
                className="hidden text-sm text-slate-300 hover:text-white sm:inline"
              >
                Backtest Data
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </nav>

          <div className="grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                Trading journal, signals, backtest, dan portfolio tracker.
              </div>
              <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
                Transparansi signal trading dan validasi strategi berbasis data.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Lihat signal aktif, hasil signal sebelumnya, dan statistik backtest strategi tanpa perlu login.
                Area dashboard tetap aman untuk admin/user terdaftar.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/public/signals"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-500"
                >
                  Lihat Signal Public
                </Link>
                <Link
                  href="/public/backtests"
                  className="rounded-xl border border-white/15 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
                >
                  Lihat Backtest
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <Metric label="Total Signals" value={stats.totalSignals.toString()} />
                <Metric label="Running" value={stats.runningSignals.toString()} />
                <Metric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
                <Metric label="Avg RR" value={`${stats.averageRR.toFixed(2)}R`} />
              </div>
              <div className="mt-6 rounded-2xl bg-slate-900/80 p-4">
                <h2 className="font-semibold">Latest Signal</h2>
                <div className="mt-4 space-y-3">
                  {latestSignals.length > 0 ? (
                    latestSignals.map((signal) => (
                      <Link
                        key={signal.id}
                        href={`/public/signals/${signal.id}`}
                        className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.07]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{signal.pair}</p>
                            <p className="text-sm text-slate-400">
                              Entry {signal.entry} · RR {signal.riskReward}:1
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              statusClasses[signal.status]
                            }`}
                          >
                            {statusLabels[signal.status]}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Belum ada signal public.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Backtest terbaru</h2>
              <p className="mt-2 text-slate-400">
                Ringkasan strategi yang sudah diuji dengan sample trade.
              </p>
            </div>
            <Link href="/public/backtests" className="text-sm font-semibold text-blue-300">
              View all →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {latestStrategies.length > 0 ? (
              latestStrategies.map((strategy) => {
                const totalTrades = strategy.backtestTrades.length;
                const wins = strategy.backtestTrades.filter((trade) => trade.result === "win").length;
                const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

                return (
                  <Link
                    key={strategy.id}
                    href={`/public/backtests/${strategy.id}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.07]"
                  >
                    <p className="text-sm text-blue-300">
                      {strategy.market} · {strategy.timeframe}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{strategy.strategyName}</h3>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-400">
                      {strategy.description || "Belum ada deskripsi strategi."}
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                      <MetricMini label="Trades" value={totalTrades.toString()} />
                      <MetricMini label="Win" value={`${winRate.toFixed(1)}%`} />
                      <MetricMini label="Target" value={strategy.rrTarget} />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-slate-400 md:col-span-3">
                Belum ada data backtest public.
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} ToDoTrade. Data-driven trading workflow.</p>
          <p>Last updated: {formatDate(new Date())}</p>
        </div>
      </footer>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-950/60 p-3">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}