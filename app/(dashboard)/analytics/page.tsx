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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">
          Analytics
        </h1>
        <p className="text-[#64748B] mt-2 font-medium">
          Analyze your trading performance and identify patterns.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <form className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              Pair
            </label>
            <select
              name="pair"
              defaultValue={selectedPair}
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
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
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              Market Type
            </label>
            <select
              name="marketType"
              defaultValue={selectedMarket}
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
            >
              <option value="all">All Markets</option>
              <option value="crypto_futures">Crypto Futures</option>
              <option value="crypto_spot">Crypto Spot</option>
              <option value="saham">Saham</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-8 h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold rounded-xl transition-all hover:scale-[1.02]"
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
          valueColor={stats.winRate >= 50 ? "text-[#10B981]" : "text-[#EF4444]"}
        />
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.totalProfit)}
          icon="💰"
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
        />
      </div>

      {/* Charts */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <AnalyticsCharts analytics={analytics} />
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h3 className="text-xl font-bold text-[#1E293B]">
            Performance by Pair
          </h3>
        </div>
        {analytics.performanceByPair.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <TableHead align="left">Pair</TableHead>
                  <TableHead>Trades</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Total P&L</TableHead>
                  <TableHead>Avg RR</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {analytics.performanceByPair.map((item) => (
                  <tr
                    key={item.pair}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-[#1E293B]">
                      {item.pair}
                    </td>
                    <td className="py-4 px-6 text-right text-[#64748B] font-medium">
                      {item.totalTrades}
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-bold ${
                        item.winRate >= 50 ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}
                    >
                      {item.winRate.toFixed(1)}%
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-bold ${
                        item.totalPL > 0
                          ? "text-[#10B981]"
                          : item.totalPL < 0
                            ? "text-[#EF4444]"
                            : "text-[#1E293B]"
                      }`}
                    >
                      {item.totalPL > 0 ? "+" : ""}
                      {formatCurrency(item.totalPL)}
                    </td>
                    <td className="py-4 px-6 text-right text-[#1E293B] font-bold">
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
            <h3 className="text-lg font-bold text-[#1E293B]">No trades yet</h3>
            <p className="text-[#64748B] mt-2 font-medium">Start journaling your trades to see performance analytics.</p>
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