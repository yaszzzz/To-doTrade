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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Trading Journal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track and analyze all your trades
          </p>
        </div>
        <Link
          href="/journal/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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
          valueColor={stats.winRate >= 50 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.totalProfit)}
          subtitle="Closed trades only"
          icon="💰"
          valueColor={
            stats.totalProfit > 0 ? "text-green-600" : "text-red-600"
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            All Trades
          </h2>
        </div>

        {trades.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              No trades yet. Start tracking your trades!
            </p>
            <Link
              href="/journal/new"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Add Your First Trade
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {trades.map(({ trade, tags }) => (
              <Link
                key={trade.id}
                href={`/journal/${trade.id}`}
                className="block p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {trade.pair}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          trade.positionType === "long"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {trade.positionType.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {trade.marketType.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
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
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
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
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            trade.result === "win"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : trade.result === "loss"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {trade.result.toUpperCase()}
                        </span>
                        {trade.profitLoss && (
                          <p
                            className={`mt-2 text-lg font-semibold ${
                              parseFloat(trade.profitLoss) > 0
                                ? "text-green-600 dark:text-green-400"
                                : parseFloat(trade.profitLoss) < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-slate-600"
                            }`}
                          >
                            {parseFloat(trade.profitLoss) > 0 ? "+" : ""}
                            {formatCurrency(parseFloat(trade.profitLoss))}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
  valueColor = "text-slate-900 dark:text-white",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-slate-600 dark:text-slate-400 text-sm">{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {subtitle}
      </p>
    </div>
  );
}