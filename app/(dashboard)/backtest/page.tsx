import {
  createBacktestStrategy,
  getBacktestStrategies,
} from "@/lib/actions/backtest.actions";
import { calculateBacktestStats } from "@/lib/calculations";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BacktestPage() {
  const strategies = await getBacktestStrategies();

  async function createAction(formData: FormData) {
    "use server";
    const result = await createBacktestStrategy(formData);
    if (result.strategyId) {
      redirect(`/backtest/${result.strategyId}`);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Research Lab
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Backtest Center
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Validasi strategi dengan data sampel, win rate, expectancy, profit
          factor, dan max drawdown.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          Buat Backtest Strategy
        </h2>
        <form action={createAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="strategyName"
            required
            placeholder="Nama strategi, contoh: Breakout London"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            name="market"
            required
            placeholder="Market, contoh: BTCUSDT / IDX"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            name="timeframe"
            required
            placeholder="Timeframe, contoh: H1"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            name="rrTarget"
            required
            placeholder="RR Target, contoh: 1:2"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <textarea
            name="description"
            placeholder="Deskripsi setup, rule utama, sesi market, filter..."
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            rows={4}
          />
          <div className="md:col-span-2">
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Simpan Strategy
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4">
        {strategies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
            Belum ada backtest strategy.
          </div>
        ) : (
          strategies.map((strategy) => {
            const stats = calculateBacktestStats(strategy.backtestTrades);
            return (
              <Link
                key={strategy.id}
                href={`/backtest/${strategy.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {strategy.strategyName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {strategy.market} • {strategy.timeframe} • Target{" "}
                      {strategy.rrTarget}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-right text-sm">
                    <Metric label="Trades" value={stats.totalTrades} />
                    <Metric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
                    <Metric label="Expectancy" value={`${stats.expectancy.toFixed(2)}R`} />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}