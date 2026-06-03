import { createTrade } from "@/lib/actions/journal.actions";
import { redirect } from "next/navigation";
import Link from "next/link";

async function handleCreateTrade(formData: FormData) {
  "use server";

  const result = await createTrade(formData);

  if (result.success) {
    redirect("/journal");
  }

  // If there's an error, it will be handled by error boundary
  // or we can throw for now
  if (result.error) {
    throw new Error(result.error);
  }
}

export default function NewTradePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/journal"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Journal
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
          Add New Trade
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Record your trade setup, risk, and execution notes
        </p>
      </div>

      {/* Form */}
      <form
        action={handleCreateTrade}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-8"
      >
        {/* Market & Pair */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Market Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="marketType"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Market Type
              </label>
              <select
                id="marketType"
                name="marketType"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="crypto_futures">Crypto Futures</option>
                <option value="crypto_spot">Crypto Spot</option>
                <option value="saham">Saham</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="pair"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Pair / Symbol
              </label>
              <input
                id="pair"
                name="pair"
                type="text"
                required
                placeholder="BTCUSDT, AAPL, BBCA"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="positionType"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Position
              </label>
              <select
                id="positionType"
                name="positionType"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
          </div>
        </section>

        {/* Trade Setup */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Trade Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label
                htmlFor="entryPrice"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Entry Price
              </label>
              <input
                id="entryPrice"
                name="entryPrice"
                type="number"
                step="any"
                required
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="stopLoss"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Stop Loss
              </label>
              <input
                id="stopLoss"
                name="stopLoss"
                type="number"
                step="any"
                required
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="takeProfit"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Take Profit
              </label>
              <input
                id="takeProfit"
                name="takeProfit"
                type="number"
                step="any"
                required
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="riskPercentage"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Risk %
              </label>
              <input
                id="riskPercentage"
                name="riskPercentage"
                type="number"
                step="0.01"
                required
                placeholder="1.00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="positionSize"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Position Size
              </label>
              <input
                id="positionSize"
                name="positionSize"
                type="number"
                step="any"
                required
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            RR Ratio will be calculated automatically from Entry, Stop Loss, and
            Take Profit.
          </p>
        </section>

        {/* Screenshot */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Screenshot
          </h2>

          <div>
            <label
              htmlFor="screenshotEntry"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Entry Screenshot URL
            </label>
            <input
              id="screenshotEntry"
              name="screenshotEntry"
              type="url"
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Temporary: paste Cloudinary image URL. Upload widget will be added
              in the next iteration.
            </p>
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Notes
          </h2>

          <div>
            <label
              htmlFor="tradingReason"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Trading Reason
            </label>
            <textarea
              id="tradingReason"
              name="tradingReason"
              rows={4}
              placeholder="Why did you take this trade?"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="psychologyNotes"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Psychology Notes
            </label>
            <textarea
              id="psychologyNotes"
              name="psychologyNotes"
              rows={4}
              placeholder="How was your emotional state before/while entering?"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>
        </section>

        {/* Hidden tags placeholder */}
        <input type="hidden" name="tags" value="[]" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/journal"
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Trade
          </button>
        </div>
      </form>
    </div>
  );
}