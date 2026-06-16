import { getCachedSession } from "@/lib/auth-cache";
import { getTradeStats, getTrades } from "@/lib/actions/journal.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getCachedSession();
  const stats = await getTradeStats();
  const recentTrades = await getTrades();
  const recentFive = recentTrades.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">
          Dashboard
        </h1>
        <p className="text-[#64748B] mt-2">
          Welcome back, {session?.user?.name}! {"Here's your trading overview."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades.toString()}
          icon="📊"
          subtitle={`${stats.openTrades} open`}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon="🎯"
          subtitle={`${stats.winningTrades}W / ${stats.losingTrades}L`}
          valueColor={stats.winRate >= 50 ? "text-[#10B981]" : "text-[#EF4444]"}
        />
        <StatCard
          title="Total Profit"
          value={formatCurrency(stats.totalProfit)}
          icon="💰"
          subtitle="Closed trades"
          valueColor={
            stats.totalProfit > 0
              ? "text-[#10B981]"
              : stats.totalProfit < 0
              ? "text-[#EF4444]"
              : "text-[#1E293B]"
          }
        />
        <StatCard
          title="Avg RR"
          value={`${stats.avgRR.toFixed(2)}:1`}
          icon="⚖️"
          subtitle="Risk/Reward"
        />
      </div>

      {/* Recent Trades */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1E293B]">
            Recent Trades
          </h2>
          <Link
            href="/journal"
            className="text-sm text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentFive.length === 0 ? (
          <div className="text-center py-12 text-[#64748B]">
            <p className="mb-4">No trades yet. Start by adding your first trade in the Journal.</p>
            <Link
              href="/journal/new"
              className="inline-block px-6 py-3 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Add Your First Trade
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentFive.map(({ trade }) => (
              <Link
                key={trade.id}
                href={`/journal/${trade.id}`}
                className="block p-4 rounded-xl border border-[#E2E8F0] hover:border-[#1E4ED8] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1E293B]">
                        {trade.pair}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                          trade.positionType === "long"
                            ? "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20"
                            : "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20"
                        }`}
                      >
                        {trade.positionType.toUpperCase()}
                      </span>
                      {trade.result && (
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                            trade.result === "win"
                              ? "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20"
                              : trade.result === "loss"
                              ? "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20"
                              : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                          }`}
                        >
                          {trade.result.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#64748B]">
                      <span>{formatDate(trade.tradeDate)}</span>
                      <span>•</span>
                      <span>RR: {trade.rrRatio}:1</span>
                      {trade.profitLoss && (
                        <>
                          <span>•</span>
                          <span
                            className={
                              parseFloat(trade.profitLoss) > 0
                                ? "text-[#10B981] font-semibold"
                                : parseFloat(trade.profitLoss) < 0
                                ? "text-[#EF4444] font-semibold"
                                : ""
                            }
                          >
                            {parseFloat(trade.profitLoss) > 0 ? "+" : ""}
                            {formatCurrency(parseFloat(trade.profitLoss))}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {!trade.result && (
                    <span className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-50 text-[#1E4ED8] border border-[#1E4ED8]/20">
                      OPEN
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction
          title="Add Trade"
          description="Record a new trade to your journal"
          icon="➕"
          href="/journal/new"
        />
        <QuickAction
          title="View Analytics"
          description="Analyze your trading performance"
          icon="📊"
          href="/analytics"
        />
        <QuickAction
          title="Add Signal"
          description="Track a new trading signal"
          icon="📡"
          href="/signals/new"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  subtitle,
  valueColor = "text-[#1E293B]",
}: {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-[#64748B] text-sm font-medium">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${valueColor}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-[#64748B] mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function QuickAction({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all group"
    >
      <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{icon}</span>
      <h3 className="text-lg font-semibold text-[#1E293B] mb-2 group-hover:text-[#1E4ED8] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[#64748B]">{description}</p>
    </Link>
  );
}