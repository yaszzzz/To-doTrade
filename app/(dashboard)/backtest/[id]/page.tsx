import {
  addBacktestTrade,
  getBacktestStrategyById,
} from "@/lib/actions/backtest.actions";
import { calculateBacktestStats } from "@/lib/calculations";
import Link from "next/link";

export default async function BacktestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const strategy = await getBacktestStrategyById(id);
  const stats = calculateBacktestStats(strategy.backtestTrades);

  async function addTradeAction(formData: FormData) {
    "use server";
    await addBacktestTrade(id, formData);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/backtest"
          className="text-sm text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
        >
          ← Back to Backtest Center
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <h1 className="text-3xl font-bold text-[#1E293B]">
            {strategy.strategyName}
          </h1>
        </div>
        <div className="flex items-center gap-3 mt-2 text-[#64748B] font-medium">
          <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">{strategy.market}</span>
          <span>•</span>
          <span>{strategy.timeframe}</span>
          <span>•</span>
          <span>Target {strategy.rrTarget}</span>
        </div>
        {strategy.description && (
          <div className="mt-6 p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
            <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-2">Strategy Description</p>
            <p className="text-[#1E293B] whitespace-pre-wrap leading-relaxed">
              {strategy.description}
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Trades" value={stats.totalTrades} icon="📊" />
        <StatCard 
          label="Win Rate" 
          value={`${stats.winRate.toFixed(1)}%`} 
          icon="🎯"
          valueColor={stats.winRate >= 50 ? "text-[#10B981]" : "text-[#EF4444]"}
        />
        <StatCard 
          label="Profit Factor" 
          value={stats.profitFactor.toFixed(2)} 
          icon="📈"
          valueColor={stats.profitFactor >= 1.5 ? "text-[#10B981]" : "text-[#EF4444]"}
        />
        <StatCard 
          label="Expectancy" 
          value={`${stats.expectancy.toFixed(2)}R`} 
          icon="⚖️"
          valueColor={stats.expectancy > 0 ? "text-[#10B981]" : "text-[#EF4444]"}
        />
        <StatCard label="Max Drawdown" value={`${stats.maxDrawdown.toFixed(2)}R`} icon="📉" />
        <StatCard label="Wins / Losses" value={`${stats.wins} / ${stats.losses}`} icon="⚔️" />
        <StatCard label="Best Win Streak" value={stats.consecutiveWins} icon="🔥" />
        <StatCard label="Worst Loss Streak" value={stats.consecutiveLosses} icon="🧊" />
      </section>

      {/* Add Sample Trade */}
      <section className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h2 className="text-xl font-semibold text-[#1E293B] mb-6">
          Add Sample Trade
        </h2>
        <form action={addTradeAction} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-[#64748B] uppercase mb-1.5 ml-1">Pair</label>
            <input
              name="pair"
              required
              placeholder="BTCUSDT"
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-[#64748B] uppercase mb-1.5 ml-1">Date</label>
            <input
              name="entryDate"
              required
              type="date"
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-[#64748B] uppercase mb-1.5 ml-1">Result</label>
            <select
              name="result"
              required
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
            >
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="breakeven">Breakeven</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-[#64748B] uppercase mb-1.5 ml-1">RR Achieved</label>
            <input
              name="rrAchieved"
              required
              type="number"
              step="0.01"
              placeholder="e.g. 2 or -1"
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
            />
          </div>
          <div className="md:col-span-1 flex items-end">
            <button className="w-full h-11 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-md">
              Add Trade
            </button>
          </div>
        </form>
      </section>

      {/* Trade Samples Table */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-[#1E293B]">
            Trade Samples
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">#</th>
                <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Pair</th>
                <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Result</th>
                <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">RR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {strategy.backtestTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4 text-[#64748B] font-medium">{trade.tradeNumber}</td>
                  <td className="p-4 text-[#1E293B] font-bold">{trade.pair}</td>
                  <td className="p-4 text-[#64748B] font-medium">{trade.entryDate.toLocaleDateString("id-ID")}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        trade.result === "win"
                          ? "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20"
                          : trade.result === "loss"
                          ? "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20"
                          : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                      }`}
                    >
                      {trade.result.toUpperCase()}
                    </span>
                  </td>
                  <td className={`p-4 font-bold ${
                    Number(trade.rrAchieved) > 0 ? "text-[#10B981]" : Number(trade.rrAchieved) < 0 ? "text-[#EF4444]" : "text-[#64748B]"
                  }`}>
                    {Number(trade.rrAchieved) > 0 ? "+" : ""}{Number(trade.rrAchieved).toFixed(2)}R
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {strategy.backtestTrades.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[#64748B] font-medium">No sample trades yet. Add your first one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon,
  valueColor = "text-[#1E293B]" 
}: { 
  label: string; 
  value: string | number;
  icon: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-[#64748B] text-sm font-medium">{label}</h3>
      <p className={`text-2xl font-bold mt-2 ${valueColor}`}>{value}</p>
    </div>
  );
}