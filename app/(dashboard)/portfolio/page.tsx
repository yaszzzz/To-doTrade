import {
  createPortfolioAsset,
  getPortfolioAssets,
} from "@/lib/actions/portfolio.actions";
import { calculatePortfolioStats } from "@/lib/calculations";

export default async function PortfolioPage() {
  const assets = await getPortfolioAssets();
  const stats = calculatePortfolioStats(assets);

  async function createAction(formData: FormData) {
    "use server";
    await createPortfolioAsset(formData);
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Portfolio Tracker
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Portfolio
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Pantau aset crypto, saham, dan cash beserta nilai portofolio dan P/L
          belum terealisasi.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Total Assets" value={stats.totalAssets} />
        <Metric label="Invested Capital" value={formatCurrency(stats.totalInvestedCapital)} />
        <Metric label="Portfolio Value" value={formatCurrency(stats.totalPortfolioValue)} />
        <Metric
          label="Unrealized P/L"
          value={formatCurrency(stats.unrealizedProfit)}
          tone={stats.unrealizedProfit >= 0 ? "profit" : "loss"}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          Tambah Asset
        </h2>
        <form action={createAction} className="grid gap-4 md:grid-cols-6">
          <select
            name="assetType"
            required
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="crypto">Crypto</option>
            <option value="saham">Saham</option>
            <option value="cash">Cash</option>
          </select>
          <input
            name="assetName"
            required
            placeholder="BTC / BBCA / IDR"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <input
            name="quantity"
            required
            type="number"
            step="any"
            placeholder="Quantity"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <input
            name="averagePrice"
            required
            type="number"
            step="any"
            placeholder="Average Price"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <input
            name="currentPrice"
            type="number"
            step="any"
            placeholder="Current Price"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Tambah
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
              <tr>
                <th className="p-4">Asset</th>
                <th className="p-4">Type</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Avg Price</th>
                <th className="p-4">Current Price</th>
                <th className="p-4">Value</th>
                <th className="p-4">P/L</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const avg = Number(asset.averagePrice);
                const current = Number(asset.currentPrice || asset.averagePrice);
                const qty = Number(asset.quantity);
                const value = qty * current;
                const profit = value - qty * avg;

                return (
                  <tr key={asset.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-4 font-medium">{asset.assetName}</td>
                    <td className="p-4 capitalize">{asset.assetType}</td>
                    <td className="p-4">{qty.toLocaleString("id-ID")}</td>
                    <td className="p-4">{formatCurrency(avg)}</td>
                    <td className="p-4">{formatCurrency(current)}</td>
                    <td className="p-4">{formatCurrency(value)}</td>
                    <td className={profit >= 0 ? "p-4 text-green-600" : "p-4 text-red-600"}>
                      {formatCurrency(profit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {assets.length === 0 && (
            <p className="p-6 text-center text-slate-500">Belum ada asset.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "profit" | "loss";
}) {
  const color =
    tone === "profit"
      ? "text-green-600"
      : tone === "loss"
        ? "text-red-600"
        : "text-slate-900 dark:text-white";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}