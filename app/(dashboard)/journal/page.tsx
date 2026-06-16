import { getTrades, getTradeStats } from "@/lib/actions/journal.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function JournalPage() {
  const trades = await getTrades();
  const stats = await getTradeStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">
            Trading Journal
          </h1>
          <p className="text-[#64748B] mt-2">
            Track and analyze all your trades
          </p>
        </div>
        <Link
          href="/journal/new"
          className="px-6 py-3 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          + Add Trade
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades.toString()}
          subtitle={`${stats.openTrades} open, ${stats.closedTrades} closed`}
          icon="📊"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subtitle={`${stats.winningTrades}W / ${stats.losingTrades}L`}
          icon="🎯"
          valueColor={stats.winRate >= 50 ? "text-[#10B981]" : "text-[#EF4444]"}
        />
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.totalProfit)}
          subtitle="Closed trades only"
          icon="💰"
          valueColor={
            stats.totalProfit > 0 ? "text-[#10B981]" : "text-[#EF4444]"
          }
        />
        <StatCard
          title="Avg RR"
          value={`${stats.avgRR.toFixed(2)}:1`}
          subtitle="Risk to Reward ratio"
          icon="⚖️"
        />
      </div>

      {/* Trades List */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-[#1E293B]">
            All Trades
          </h2>
        </div>

        {trades.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#64748B] mb-4">
              No trades yet. Start tracking your trades!
            </p>
            <Link
              href="/journal/new"
              className="inline-block px-6 py-3 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Add Your First Trade
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {trades.map(({ trade, tags }) => (
              <Link
                key={trade.id}
                href={`/journal/${trade.id}`}
                className="block p-6 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#1E293B]">
                        {trade.pair}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                          trade.positionType === "long"
                            ? "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20"
                            : "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20"
                        }`}
                      >
                        {trade.positionType.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                        {trade.marketType.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B]">
                      <span>Entry: {trade.entryPrice}</span>
                      <span>SL: {trade.stopLoss}</span>
                      <span>TP: {trade.takeProfit}</span>
                      <span>RR: {trade.rrRatio}:1</span>
                      <span>{formatDate(trade.tradeDate)}</span>
                    </div>

                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-50 text-[#1E4ED8] border border-[#1E4ED8]/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    {trade.result ? (
                      <div>
                        <span
                          className={`inline-block px-4 py-2 text-sm font-semibold rounded-xl ${
                            trade.result === "win"
                              ? "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20"
                              : trade.result === "loss"
                              ? "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20"
                              : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                          }`}
                        >
                          {trade.result.toUpperCase()}
                        </span>
                        {trade.profitLoss && (
                          <p
                            className={`mt-2 text-lg font-bold ${
                              parseFloat(trade.profitLoss) > 0
                                ? "text-[#10B981]"
                                : parseFloat(trade.profitLoss) < 0
                                ? "text-[#EF4444]"
                                : "text-[#64748B]"
                            }`}
                          >
                            {parseFloat(trade.profitLoss) > 0 ? "+" : ""}
                            {formatCurrency(parseFloat(trade.profitLoss))}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block px-4 py-2 text-sm font-semibold rounded-xl bg-blue-50 text-[#1E4ED8] border border-[#1E4ED8]/20">
                        OPEN
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  valueColor = "text-[#1E293B]",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-[#64748B] text-sm font-medium">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${valueColor}`}>{value}</p>
      <p className="text-xs text-[#64748B] mt-2">
        {subtitle}
      </p>
    </div>
  );
}