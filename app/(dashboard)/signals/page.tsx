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

const statusConfig: Record<SignalStatus, { bg: string; text: string; icon: string }> = {
  running: { bg: "bg-[#DBEAFE]", text: "text-[#1E4ED8]", icon: "⏱️" },
  hit_tp: { bg: "bg-[#D1FAE5]", text: "text-[#10B981]", icon: "✅" },
  hit_sl: { bg: "bg-[#FEE2E2]", text: "text-[#EF4444]", icon: "❌" },
  cancelled: { bg: "bg-[#F3F4F6]", text: "text-[#64748B]", icon: "🚫" },
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">
            Trading Signals
          </h1>
          <p className="text-[#64748B] mt-2 font-medium">
            Track signal ideas from entry plan to final outcome.
          </p>
        </div>

        <Link
          href="/signals/new"
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          New Signal
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Signals" 
          value={stats.totalSignals.toString()} 
          icon="📊"
        />
        <StatCard 
          title="Running" 
          value={stats.runningSignals.toString()}
          icon="⏱️"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon="🎯"
          valueColor={stats.winRate >= 50 ? "text-[#10B981]" : "text-[#EF4444]"}
        />
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.totalProfitLoss)}
          icon="💰"
          valueColor={
            stats.totalProfitLoss > 0
              ? "text-[#10B981]"
              : stats.totalProfitLoss < 0
                ? "text-[#EF4444]"
                : "text-[#1E293B]"
          }
        />
      </div>

      {/* Search & Filter Form */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <form className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search pair or analysis..."
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              Status
            </label>
            <select
              name="status"
              defaultValue={selectedStatus}
              className="w-full md:w-48 h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
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
            className="px-8 h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold rounded-xl transition-all hover:scale-[1.02]"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Signals Table */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
        {signals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
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
              <tbody className="divide-y divide-[#E2E8F0]">
                {signals.map((signal) => {
                  const config = statusConfig[signal.status];
                  return (
                    <tr
                      key={signal.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-[#1E293B]">
                        {signal.pair}
                      </td>
                      <td className="py-4 px-6 text-right text-[#64748B] font-medium">
                        {signal.entry}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-[#EF4444]">
                        {signal.stopLoss}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-[#10B981]">
                        {signal.takeProfit}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#1E293B]">
                        {signal.riskReward}:1
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${config.bg} ${config.text}`}>
                          <span>{config.icon}</span>
                          {statusLabels[signal.status]}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-[#64748B] font-medium">
                        {formatDate(signal.signalDate)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/signals/${signal.id}`}
                          className="text-[#1E4ED8] hover:text-[#1D4ED8] font-bold transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="text-lg font-bold text-[#1E293B]">
              No signals found
            </h3>
            <p className="text-[#64748B] mt-2 font-medium">
              Create your first signal to start tracking trade ideas.
            </p>
            <Link
              href="/signals/new"
              className="inline-flex mt-6 px-8 py-3 rounded-xl bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold transition-all hover:scale-[1.02] shadow-lg"
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
  icon,
  valueColor = "text-[#1E293B]",
}: {
  title: string;
  value: string;
  icon: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-[#64748B] text-sm font-medium mb-1">
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
      className={`py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      {children}
    </th>
  );
}