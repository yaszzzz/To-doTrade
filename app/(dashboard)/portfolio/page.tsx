import {
  createPortfolioAsset,
  getPortfolioAssets,
} from "@/lib/actions/portfolio.actions";
import { calculatePortfolioStats } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import PageContainer from "@/components/layout/page-container";

export default async function PortfolioPage() {
  const assets = await getPortfolioAssets();
  const stats = calculatePortfolioStats(assets);

  async function createAction(formData: FormData) {
    "use server";
    await createPortfolioAsset(formData);
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Portfolio Tracker
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
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
                ? "text-green-600 dark:text-green-500"
                : stats.unrealizedProfit < 0
                  ? "text-red-600 dark:text-red-500"
                  : ""
            }
          />
        </div>

        {/* Add Asset Form */}
        <div className="bg-card rounded-lg border p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">
            Add New Asset
          </h2>
          <form action={createAction} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Type</label>
              <select
                name="assetType"
                required
                className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
              >
                <option value="crypto">Crypto</option>
                <option value="saham">Saham</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Asset Name</label>
              <input
                name="assetName"
                required
                placeholder="BTC / BBCA / IDR"
                className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background placeholder:text-muted-foreground transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Quantity</label>
              <input
                name="quantity"
                required
                type="number"
                step="any"
                placeholder="0.00"
                className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background placeholder:text-muted-foreground transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Avg Price</label>
              <input
                name="averagePrice"
                required
                type="number"
                step="any"
                placeholder="0.00"
                className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background placeholder:text-muted-foreground transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Current Price</label>
              <input
                name="currentPrice"
                type="number"
                step="any"
                placeholder="0.00"
                className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background placeholder:text-muted-foreground transition-all"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all hover:scale-[1.02] shadow-sm hover:shadow-md">
                Add Asset
              </button>
            </div>
          </form>
        </div>

        {/* Holdings Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Your Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted border-b">
                  <TableHead align="left">Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Avg Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>P/L</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assets.map((asset) => {
                  const avg = Number(asset.averagePrice);
                  const current = Number(asset.currentPrice || asset.averagePrice);
                  const qty = Number(asset.quantity);
                  const value = qty * current;
                  const profit = value - qty * avg;

                  return (
                    <tr key={asset.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-bold">
                        {asset.assetName}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-muted text-muted-foreground capitalize">
                          {asset.assetType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-medium">
                        {qty.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground font-medium">
                        {formatCurrency(avg)}
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground font-medium">
                        {formatCurrency(current)}
                      </td>
                      <td className="py-4 px-6 text-right font-bold">
                        {formatCurrency(value)}
                      </td>
                      <td className={`py-4 px-6 text-right font-bold ${profit >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
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
                <h3 className="text-lg font-bold">No assets yet</h3>
                <p className="text-muted-foreground mt-2 font-medium">Add your first asset to start tracking your portfolio.</p>
              </div>
            )}
          </div>
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