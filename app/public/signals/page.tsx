import Link from "next/link";
import {
  getPublicSignalStats,
  getPublicSignals,
  type PublicSignalStatus,
} from "@/lib/actions/public.actions";
import { formatDate } from "@/lib/utils";

type PublicSignalsPageProps = {
  searchParams: Promise<{
    status?: PublicSignalStatus | "all";
    search?: string;
  }>;
};

const statusLabels: Record<PublicSignalStatus, string> = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
};

const statusClasses: Record<PublicSignalStatus, string> = {
  running: "bg-blue-100 text-blue-700",
  hit_tp: "bg-green-100 text-green-700",
  hit_sl: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-700",
};

export default async function PublicSignalsPage({
  searchParams,
}: PublicSignalsPageProps) {
  const params = await searchParams;
  const selectedStatus = params.status ?? "all";
  const search = params.search ?? "";

  const [signals, stats] = await Promise.all([
    getPublicSignals({ status: selectedStatus, search }),
    getPublicSignalStats(),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNav />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              Public Trading Signals
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Signal trading terbuka
            </h1>
            <p className="mt-4 max-w-2xl text-slate-400">
              Data read-only untuk publik. User ID, P&L internal, dan akses edit
              tetap disembunyikan.
            </p>
          </div>
          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-500"
          >
            Join Dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard title="Total Signals" value={stats.totalSignals.toString()} />
          <StatCard title="Running" value={stats.runningSignals.toString()} />
          <StatCard title="Hit TP" value={stats.hitTpSignals.toString()} />
          <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
        </div>

        <form className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_220px_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Search pair / analysis
            </label>
            <input
              name="search"
              defaultValue={search}
              placeholder="BTCUSDT, ETH, setup..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Status
            </label>
            <select
              name="status"
              defaultValue={selectedStatus}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="hit_tp">Hit TP</option>
              <option value="hit_sl">Hit SL</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
          >
            Filter
          </button>
        </form>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          {signals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px]">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-slate-400">
                    <TableHead align="left">Pair</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Stop Loss</TableHead>
                    <TableHead>Take Profit</TableHead>
                    <TableHead>RR</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Detail</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal) => (
                    <tr key={signal.id} className="border-b border-white/5">
                      <td className="px-4 py-4 font-semibold">{signal.pair}</td>
                      <td className="px-4 py-4 text-right text-slate-300">
                        {signal.entry}
                      </td>
                      <td className="px-4 py-4 text-right text-red-300">
                        {signal.stopLoss}
                      </td>
                      <td className="px-4 py-4 text-right text-green-300">
                        {signal.takeProfit}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-300">
                        {signal.riskReward}:1
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusClasses[signal.status]
                          }`}
                        >
                          {statusLabels[signal.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-400">
                        {formatDate(signal.signalDate)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/public/signals/${signal.id}`}
                          className="font-medium text-blue-300 hover:text-blue-200"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400">
              Belum ada signal yang cocok dengan filter.
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
          <Link href="/public/backtests" className="text-slate-300 hover:text-white">
            Backtests
          </Link>
          <Link href="/login" className="text-slate-300 hover:text-white">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function TableHead({
  children,
  align = "right",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 font-medium ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      {children}
    </th>
  );
}