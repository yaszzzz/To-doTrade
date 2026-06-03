import Link from "next/link";
import { getSignals, getSignalStats, type SignalStatus } from "@/lib/actions/signals.actions";
import { formatCurrency, formatDate } from "@/lib/utils";

type SignalsPageProps = {
  searchParams: Promise<{
    status?: SignalStatus | "all";
    search?: string;
  }>;
};

const statusLabels: Record<SignalStatus, string> = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
};

const statusClasses: Record<SignalStatus, string> = {
  running: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  hit_tp: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  hit_sl: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  cancelled: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default async function SignalsPage({ searchParams }: SignalsPageProps) {
  const params = await searchParams;
  const selectedStatus = params.status ?? "all";
  const search = params.search ?? "";

  const [signals, stats] = await Promise.all([
    getSignals({ status: selectedStatus, search }),
    getSignalStats(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Trading Signals
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track signal ideas from entry plan to final outcome.
          </p>
        </div>

        <Link
          href="/signals/new"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          New Signal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Signals" value={stats.totalSignals.toString()} />
        <StatCard title="Running" value={stats.runningSignals.toString()} />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          valueColor={stats.winRate >= 50 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.totalProfitLoss)}
          valueColor={
            stats.totalProfitLoss > 0
              ? "text-green-600"
              : stats.totalProfitLoss < 0
                ? "text-red-600"
                : "text-slate-900 dark:text-white"
          }
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
        <form className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search pair or analysis..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              name="status"
              defaultValue={selectedStatus}
              className="w-full md:w-44 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
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
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium rounded-lg transition-colors"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {signals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <TableHead align="left">Pair</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>SL</TableHead>
                  <TableHead>TP</TableHead>
                  <TableHead>RR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr
                    key={signal.id}
                    className="border-b border-slate-100 dark:border-slate-800/50"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {signal.pair}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {signal.entry}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      {signal.stopLoss}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      {signal.takeProfit}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {signal.riskReward}:1
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusClasses[signal.status]
                        }`}
                      >
                        {statusLabels[signal.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {formatDate(signal.signalDate)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/signals/${signal.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
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
          <div className="text-center py-14">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              No signals found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Create your first signal to start tracking trade ideas.
            </p>
            <Link
              href="/signals/new"
              className="inline-flex mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              New Signal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  valueColor = "text-slate-900 dark:text-white",
}: {
  title: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <h3 className="text-slate-600 dark:text-slate-400 text-sm mb-2">
        {title}
      </h3>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
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
      className={`py-3 px-4 text-slate-600 dark:text-slate-400 font-medium ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      {children}
    </th>
  );
}