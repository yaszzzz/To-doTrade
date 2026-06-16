import { getCachedSession } from "@/lib/auth-cache";
import { getTradeStats, getTrades } from "@/lib/actions/journal.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageContainer from "@/components/layout/page-container";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getCachedSession();
  const stats = await getTradeStats();
  const recentTrades = await getTrades();
  const recentFive = recentTrades.slice(0, 5);

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
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
            valueColor={stats.winRate >= 50 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}
          />
          <StatCard
            title="Total Profit"
            value={formatCurrency(stats.totalProfit)}
            icon="💰"
            subtitle="Closed trades"
            valueColor={
              stats.totalProfit > 0
                ? "text-green-600 dark:text-green-500"
                : stats.totalProfit < 0
                ? "text-red-600 dark:text-red-500"
                : ""
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
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Recent Trades
            </h2>
            <Link
              href="/journal"
              className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              View all →
            </Link>
          </div>

          {recentFive.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">No trades yet. Start by adding your first trade in the Journal.</p>
              <Link
                href="/journal/new"
                className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
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
                  className="block p-4 rounded-lg border hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {trade.pair}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                            trade.positionType === "long"
                              ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                              : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}
                        >
                          {trade.positionType.toUpperCase()}
                        </span>
                        {trade.result && (
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                              trade.result === "win"
                                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                : trade.result === "loss"
                                ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                                : "bg-muted text-muted-foreground border"
                            }`}
                          >
                            {trade.result.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDate(trade.tradeDate)}</span>
                        <span>•</span>
                        <span>RR: {trade.rrRatio}:1</span>
                        {trade.profitLoss && (
                          <>
                            <span>•</span>
                            <span
                              className={
                                parseFloat(trade.profitLoss) > 0
                                  ? "text-green-600 dark:text-green-500 font-semibold"
                                  : parseFloat(trade.profitLoss) < 0
                                  ? "text-red-600 dark:text-red-500 font-semibold"
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
                      <span className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20">
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
    </PageContainer>
  );
}

function StatCard({
  title,
  value,
  icon,
  subtitle,
  valueColor = "",
}: {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${valueColor}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">
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
      className="bg-card rounded-lg border p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{icon}</span>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}