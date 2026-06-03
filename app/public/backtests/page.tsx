import Link from "next/link";
import { getPublicBacktestStrategies } from "@/lib/actions/public.actions";
import { calculatePublicBacktestStats } from "@/lib/public-stats";
import { formatDate } from "@/lib/utils";

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
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNav />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              Public Backtest Data
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Validasi strategi trading
            </h1>
            <p className="mt-4 max-w-2xl text-slate-400">
              Ringkasan backtest read-only untuk membantu publik melihat performa
              setup dan sample trade tanpa mengakses dashboard internal.
            </p>
          </div>
          <Link
            href="/public/signals"
            className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold hover:bg-white/10"
          >
            Lihat Signals
          </Link>
        </div>

        <form className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Search strategy / market / timeframe
            </label>
            <input
              name="search"
              defaultValue={search}
              placeholder="SMC, BTC, 1H..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
          >
            Filter
          </button>
        </form>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {strategies.length > 0 ? (
            strategies.map((strategy) => {
              const stats = calculatePublicBacktestStats(strategy.backtestTrades);

              return (
                <Link
                  key={strategy.id}
                  href={`/public/backtests/${strategy.id}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-blue-300">
                        {strategy.market} · {strategy.timeframe}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">
                        {strategy.strategyName}
                      </h2>
                    </div>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                      {strategy.rrTarget}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                    {strategy.description || "Belum ada deskripsi strategi."}
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <Metric label="Trades" value={stats.totalTrades.toString()} />
                    <Metric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
                    <Metric label="Avg RR" value={`${stats.averageRR.toFixed(2)}R`} />
                  </div>

                  <p className="mt-5 text-xs text-slate-500">
                    Updated {formatDate(strategy.updatedAt)}
                  </p>
                </Link>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400 md:col-span-2 xl:col-span-3">
              Belum ada backtest yang cocok dengan filter.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function PublicNav() {
  return (
    <nav className="border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="text-xl font-bold">
          ToDoTrade
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/public/signals" className="text-slate-300 hover:text-white">
            Signals
          </Link>
          <Link href="/login" className="text-slate-300 hover:text-white">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-950/60 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}