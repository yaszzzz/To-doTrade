import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { getAnalytics, getUniquePairs } from "@/lib/actions/analytics.actions";
import { getTradeStats } from "@/lib/actions/journal.actions";
import { formatCurrency } from "@/lib/utils";
import PageContainer from "@/components/layout/page-container";

type AnalyticsPageProps = {
  searchParams: Promise<{
    pair?: string;
    marketType?: string;
  }>;
};

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const params = await searchParams;
  const selectedPair = params.pair ?? "all";
  const selectedMarket = params.marketType ?? "all";

  const filters: {
    pair?: string;
    marketType?: string;
  } = {};

  if (selectedPair !== "all") filters.pair = selectedPair;
  if (selectedMarket !== "all") filters.marketType = selectedMarket;

  const [analytics, stats, pairs] = await Promise.all([
    getAnalytics(filters),
    getTradeStats(),
    getUniquePairs(),
  ]);

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Analyze your trading performance and identify patterns.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <form className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">
                Pair
              </label>
              <select
                name="pair"
                defaultValue={selectedPair}
                className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
              >
                <option value="all">All Pairs</option>
                {pairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">
                Market Type
              </label>
              <select
                name="marketType"
                defaultValue={selectedMarket}
                className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
              >
                <option value="all">All Markets</option>
                <option value="crypto_futures">Crypto Futures</option>
                <option value="crypto_spot">Crypto Spot</option>
                <option value="saham">Saham</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-8 h-11 bg-foreground hover:bg-foreground/90 text-background font-bold rounded-lg transition-all hover:scale-[1.02]"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Trades" 
            value={stats.totalTrades.toString()} 
            icon="📊"
          />
          <StatCard
            title="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            icon="🎯"
            valueColor={stats.winRate >= 50 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}
          />
          <StatCard
            title="Total P&L"
            value={formatCurrency(stats.totalProfit)}
            icon="💰"
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
          />
        </div>

        {/* Charts */}
        <div className="bg-card rounded-lg border p-8 shadow-sm">
          <AnalyticsCharts analytics={analytics} />
        </div>

        {/* Performance Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">
              Performance by Pair
            </h3>
          </div>
          {analytics.performanceByPair.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted border-b">
                    <TableHead align="left">Pair</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Total P&L</TableHead>
                    <TableHead>Avg RR</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {analytics.performanceByPair.map((item) => (
                    <tr
                      key={item.pair}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-bold">
                        {item.pair}
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground font-medium">
                        {item.totalTrades}
                      </td>
                      <td
                        className={`py-4 px-6 text-right font-bold ${
                          item.winRate >= 50 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        {item.winRate.toFixed(1)}%
                      </td>
                      <td
                        className={`py-4 px-6 text-right font-bold ${
                          item.totalPL > 0
                            ? "text-green-600 dark:text-green-500"
                            : item.totalPL < 0
                              ? "text-red-600 dark:text-red-500"
                              : ""
                        }`}
                      >
                        {item.totalPL > 0 ? "+" : ""}
                        {formatCurrency(item.totalPL)}
                      </td>
                      <td className="py-4 px-6 text-right font-bold">
                        {item.avgRR.toFixed(2)}:1
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📊</p>
              <h3 className="text-lg font-bold">No trades yet</h3>
              <p className="text-muted-foreground mt-2 font-medium">Start journaling your trades to see performance analytics.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function StatCard({
  title,
  value,
  icon,
  valueColor = "",
}: {
  title: string;
  value: string;
  icon: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-muted-foreground text-sm font-medium mb-1">
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
      className={`py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      {children}
    </th>
  );
}
