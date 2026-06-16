import {
  createBacktestStrategy,
  getBacktestStrategies,
} from "@/lib/actions/backtest.actions";
import { calculateBacktestStats } from "@/lib/calculations";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BacktestPage() {
  const strategies = await getBacktestStrategies();

  async function createAction(formData: FormData) {
    "use server";
    const result = await createBacktestStrategy(formData);
    if (result.strategyId) {
      redirect(`/backtest/${result.strategyId}`);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">
          Backtest Center
        </h1>
        <p className="text-[#64748B] mt-2 font-medium">
          Validate your strategies with historical data and statistical analysis
        </p>
      </div>

      {/* Create Strategy Form */}
      <section className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h2 className="text-xl font-semibold text-[#1E293B] mb-6">
          Create New Strategy
        </h2>
        <form action={createAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Strategy Name
              </label>
              <input
                name="strategyName"
                required
                placeholder="e.g. Breakout London, SMC Trend Following"
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Market / Symbol
              </label>
              <input
                name="market"
                required
                placeholder="e.g. BTCUSDT, EURUSD, IDX"
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Timeframe
              </label>
              <input
                name="timeframe"
                required
                placeholder="e.g. 15m, 1h, 4h, Daily"
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                RR Target
              </label>
              <input
                name="rrTarget"
                required
                placeholder="e.g. 1:2, 1:3"
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              Strategy Description & Rules
            </label>
            <textarea
              name="description"
              placeholder="Describe your setup, entry rules, exit rules, and filters..."
              className="w-full p-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              rows={4}
            />
          </div>
          <button className="px-8 py-3 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl">
            Save Strategy
          </button>
        </form>
      </section>

      {/* Strategies List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1E293B]">
          Your Strategies
        </h2>
        {strategies.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-dashed border-[#CBD5E1] p-12 text-center">
            <p className="text-[#64748B] font-medium">
              No backtest strategies yet. Create your first one above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {strategies.map((strategy) => {
              const stats = calculateBacktestStats(strategy.backtestTrades);
              return (
                <Link
                  key={strategy.id}
                  href={`/backtest/${strategy.id}`}
                  className="group bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-[#1E4ED8] transition-colors">
                        {strategy.strategyName}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-[#64748B] font-medium">
                        <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">{strategy.market}</span>
                        <span>•</span>
                        <span>{strategy.timeframe}</span>
                        <span>•</span>
                        <span>Target {strategy.rrTarget}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <Metric label="Total Trades" value={stats.totalTrades} />
                      <Metric 
                        label="Win Rate" 
                        value={`${stats.winRate.toFixed(1)}%`}
                        valueColor={stats.winRate >= 50 ? "text-[#10B981]" : "text-[#EF4444]"}
                      />
                      <Metric 
                        label="Expectancy" 
                        value={`${stats.expectancy.toFixed(2)}R`}
                        valueColor={stats.expectancy > 0 ? "text-[#10B981]" : "text-[#EF4444]"}
                      />
                      <div className="text-[#CBD5E1] group-hover:text-[#1E4ED8] transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ 
  label, 
  value, 
  valueColor = "text-[#1E293B]" 
}: { 
  label: string; 
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div className="text-right">
      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}