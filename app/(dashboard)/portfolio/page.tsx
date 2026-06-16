import {
  createPortfolioAsset,
  getPortfolioAssets,
} from "@/lib/actions/portfolio.actions";
import { calculatePortfolioStats } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

export default async function PortfolioPage() {
  const assets = await getPortfolioAssets();
  const stats = calculatePortfolioStats(assets);

  async function createAction(formData: FormData) {
    "use server";
    await createPortfolioAsset(formData);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">
          Portfolio Tracker
        </h1>
        <p className="text-[#64748B] mt-2 font-medium">
          Monitor your crypto, stocks, and cash assets in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Assets" 
          value={stats.totalAssets.toString()} 
          icon="📊"
        />
        <StatCard 
          title="Invested Capital" 
          value={formatCurrency(stats.totalInvestedCapital)}
          icon="💰"
        />
        <StatCard
          title="Portfolio Value"
          value={formatCurrency(stats.totalPortfolioValue)}
          icon="📈"
        />
        <StatCard
          title="Unrealized P&L"
          value={formatCurrency(stats.unrealizedProfit)}
          icon="🎯"
          valueColor={
            stats.unrealizedProfit > 0
              ? "text-[#10B981]"
              : stats.unrealizedProfit < 0
                ? "text-[#EF4444]"
                : "text-[#1E293B]"
          }
        />
      </div>

      {/* Add Asset Form */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h2 className="text-xl font-bold text-[#1E293B] mb-6">
          Add New Asset
        </h2>
        <form action={createAction} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Type</label>
            <select
              name="assetType"
              required
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
            >
              <option value="crypto">Crypto</option>
              <option value="saham">Saham</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Asset Name</label>
            <input
              name="assetName"
              required
              placeholder="BTC / BBCA / IDR"
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Quantity</label>
            <input
              name="quantity"
              required
              type="number"
              step="any"
              placeholder="0.00"
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Avg Price</label>
            <input
              name="averagePrice"
              required
              type="number"
              step="any"
              placeholder="0.00"
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Current Price</label>
            <input
              name="currentPrice"
              type="number"
              step="any"
              placeholder="0.00"
              className="w-full h-11 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full h-11 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg">
              Add Asset
            </button>
          </div>
        </form>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1E293B]">Your Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <TableHead align="left">Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>P/L</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {assets.map((asset) => {
                const avg = Number(asset.averagePrice);
                const current = Number(asset.currentPrice || asset.averagePrice);
                const qty = Number(asset.quantity);
                const value = qty * current;
                const profit = value - qty * avg;

                return (
                  <tr key={asset.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-6 font-bold text-[#1E293B]">
                      {asset.assetName}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F1F5F9] text-[#64748B] capitalize">
                        {asset.assetType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-[#1E293B] font-medium">
                      {qty.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6 text-right text-[#64748B] font-medium">
                      {formatCurrency(avg)}
                    </td>
                    <td className="py-4 px-6 text-right text-[#64748B] font-medium">
                      {formatCurrency(current)}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-[#1E293B]">
                      {formatCurrency(value)}
                    </td>
                    <td className={`py-4 px-6 text-right font-bold ${profit >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                      {formatCurrency(profit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {assets.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">💰</p>
              <h3 className="text-lg font-bold text-[#1E293B]">No assets yet</h3>
              <p className="text-[#64748B] mt-2 font-medium">Add your first asset to start tracking your portfolio.</p>
            </div>
          )}
        </div>
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