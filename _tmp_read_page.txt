import {
  addBacktestTrade,
  getBacktestStrategyById,
} from "@/lib/actions/backtest.actions";
import { calculateBacktestStats } from "@/lib/calculations";
import Link from "next/link";

export default async function BacktestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const strategy = await getBacktestStrategyById(id);
  const stats = calculateBacktestStats(strategy.backtestTrades);

  async function addTradeAction(formData: FormData) {
    "use server";
    await addBacktestTrade(id, formData);
  }

  return (
    <div className="space-y-8">
      <Link href="/backtest" className="text-sm font-medium text-blue-600">
        ← Backtest Center
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {strategy.strategyName}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {strategy.market} • {strategy.timeframe} • Target {strategy.rrTarget}
        </p>
        {strategy.description && (
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
            {strategy.description}
          </p>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Total Trades" value={stats.totalTrades} />
        <Metric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
        <Metric label="Profit Factor" value={stats.profitFactor.toFixed(2)} />
        <Metric label="Max Drawdown" value={`${stats.maxDrawdown.toFixed(2)}R`} />
        <Metric label="Expectancy" value={`${stats.expectancy.toFixed(2)}R`} />
        <Metric label="Wins / Losses" value={`${stats.wins} / ${stats.losses}`} />
        <Metric label="Best Win Streak" value={stats.consecutiveWins} />
        <Metric label="Worst Loss Streak" value={stats.consecutiveLosses} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          Tambah Sample Trade
        </h2>
        <form action={addTradeAction} className="grid gap-4 md:grid-cols-5">
          <input
            name="pair"
            required
            placeholder="BTCUSDT"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <input
            name="entryDate"
            required
            type="date"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <select
            name="result"
            required
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="breakeven">Breakeven</option>
          </select>
          <input
            name="rrAchieved"
            required
            type="number"
            step="0.01"
            placeholder="RR, contoh: 2 atau -1"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Tambah
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Trade Samples
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Pair</th>
                <th className="p-4">Date</th>
                <th className="p-4">Result</th>
                <th className="p-4">RR</th>
              </tr>
            </thead>
            <tbody>
              {strategy.backtestTrades.map((trade) => (
                <tr key={trade.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-4">{trade.tradeNumber}</td>
                  <td className="p-4 font-medium">{trade.pair}</td>
                  <td className="p-4">{trade.entryDate.toLocaleDateString("id-ID")}</td>
                  <td className="p-4 capitalize">{trade.result}</td>
                  <td className="p-4">{Number(trade.rrAchieved).toFixed(2)}R</td>
                </tr>
              ))}
            </tbody>
          </table>
          {strategy.backtestTrades.length === 0 && (
            <p className="p-6 text-center text-slate-500">Belum ada sample trade.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}