import { getCachedSession } from "@/lib/auth-cache";
import { getTradeStats, getTrades } from "@/lib/actions/journal.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageContainer from "@/components/layout/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";

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
            Hi, Welcome back 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            {session?.user?.name}! {"Here's your trading overview."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Trades</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.totalTrades}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUp className="size-4" />
                  {stats.openTrades} open
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Total trades recorded
              </div>
              <div className="text-muted-foreground">{stats.openTrades} currently open</div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Win Rate</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.winRate.toFixed(1)}%
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.winRate >= 50 ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                  {stats.winRate >= 50 ? "+" : ""}{stats.winRate.toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.winRate >= 50 ? "Strong performance" : "Needs improvement"}
              </div>
              <div className="text-muted-foreground">{stats.winningTrades}W / {stats.losingTrades}L</div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Profit</CardDescription>
              <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${
                stats.totalProfit > 0
                  ? "text-green-600 dark:text-green-500"
                  : stats.totalProfit < 0
                  ? "text-red-600 dark:text-red-500"
                  : ""
              }`}>
                {formatCurrency(stats.totalProfit)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.totalProfit >= 0 ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                  {stats.totalProfit >= 0 ? "+" : ""}{formatCurrency(stats.totalProfit)}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.totalProfit >= 0 ? "Profitable trading" : "Loss position"}
              </div>
              <div className="text-muted-foreground">Closed trades P&L</div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Avg RR</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.avgRR.toFixed(2)}:1
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUp className="size-4" />
                  {stats.avgRR.toFixed(2)}:1
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Risk/Reward ratio
              </div>
              <div className="text-muted-foreground">Average across all trades</div>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Recent Trades
              </CardTitle>
              <Link
                href="/journal"
                className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                View all →
              </Link>
            </div>
          </CardHeader>

          <div className="px-6 pb-6">
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
        </Card>

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