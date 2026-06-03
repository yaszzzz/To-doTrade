import { auth } from "@/lib/auth";
import { getTradeStats, getTrades } from "@/lib/actions/journal.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getTradeStats();
  const recentTrades = await getTrades();
  const recentFive = recentTrades.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Welcome back, {session?.user?.name}! Here's your trading overview.
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
          valueColor={stats.winRate >= 50 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          title="Total Profit"
          value={formatCurrency(stats.totalProfit)}
          icon="💰"
          subtitle="Closed trades"
          valueColor={
            stats.totalProfit > 0
              ? "text-green-600 dark:text-green-400"
              : stats.totalProfit < 0
              ? "text-red-600 dark:text-red-400"
              : "text-slate-900 dark:text-white"
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
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Recent Trades
          </h2>
          <Link
            href="/journal"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {recentFive.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p>No trades yet. Start by adding your first trade in the Journal.</p>
            <Link
              href="/journal/new"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Add Your First Trade
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentFive.map(({ trade, tags }) => (
              <Link
                key={trade.id}
                href={`/journal/${trade.id}`}
                className="block p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {trade.pair}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          trade.positionType === "long"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {trade.positionType.toUpperCase()}
                      </span>
                      {trade.result && (
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            trade.result === "win"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : trade.result === "loss"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {trade.result.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span>{formatDate(trade.tradeDate)}</span>
                      <span>•</span>
                      <span>RR: {trade.rrRatio}:1</span>
                      {trade.profitLoss && (
                        <>
                          <span>•</span>
                          <span
                            className={
                              parseFloat(trade.profitLoss) > 0
                                ? "text-green-600 dark:text-green-400"
                                : parseFloat(trade.profitLoss) < 0
                                ? "text-red-600 dark:text-red-400"
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
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
  valueColor = "text-slate-900 dark:text-white",
}: {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-slate-600 dark:text-slate-400 text-sm">{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
      className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
    >
      <span className="text-3xl mb-3 block">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </Link>
  );
}