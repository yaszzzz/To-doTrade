import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { getAnalytics, getUniquePairs } from "@/lib/actions/analytics.actions";
import { getTradeStats } from "@/lib/actions/journal.actions";
import { formatCurrency } from "@/lib/utils";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Analyze your trading performance and identify patterns
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
        <form className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Pair
            </label>
            <select
              name="pair"
              defaultValue={selectedPair}
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="all">All Pairs</option>
              {pairs.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Market Type
            </label>
            <select
              name="marketType"
              defaultValue={selectedMarket}
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="all">All Markets</option>
              <option value="crypto_futures">Crypto Futures</option>
              <option value="crypto_spot">Crypto Spot</option>
              <option value="saham">Saham</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Trades" value={stats.totalTrades.toString()} />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          valueColor={stats.winRate >= 50 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.totalProfit)}
          valueColor={
            stats.totalProfit > 0
              ? "text-green-600"
              : stats.totalProfit < 0
                ? "text-red-600"
                : "text-slate-900 dark:text-white"
          }
        />
        <StatCard title="Avg RR" value={`${stats.avgRR.toFixed(2)}:1`} />
      </div>

      <AnalyticsCharts analytics={analytics} />

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Performance by Pair
        </h3>
        {analytics.performanceByPair.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <TableHead align="left">Pair</TableHead>
                  <TableHead>Trades</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Total P&L</TableHead>
                  <TableHead>Avg RR</TableHead>
                </tr>
              </thead>
              <tbody>
                {analytics.performanceByPair.map((item) => (
                  <tr
                    key={item.pair}
                    className="border-b border-slate-100 dark:border-slate-800/50"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      {item.pair}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {item.totalTrades}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        item.winRate >= 50 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.winRate.toFixed(1)}%
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        item.totalPL > 0
                          ? "text-green-600"
                          : item.totalPL < 0
                            ? "text-red-600"
                            : "text-slate-600"
                      }`}
                    >
                      {item.totalPL > 0 ? "+" : ""}
                      {formatCurrency(item.totalPL)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {item.avgRR.toFixed(2)}:1
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">No trades yet</div>
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