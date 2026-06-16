import { createTrade } from "@/lib/actions/journal.actions";
import { redirect } from "next/navigation";
import Link from "next/link";

async function handleCreateTrade(formData: FormData) {
  "use server";

  const result = await createTrade(formData);

  if (result.success) {
    redirect("/journal");
  }

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
          className="text-sm text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
        >
          ← Back to Journal
        </Link>
        <h1 className="text-3xl font-bold text-[#1E293B] mt-4">
          Add New Trade
        </h1>
        <p className="text-[#64748B] mt-2 font-medium">
          Record your trade setup, risk, and execution notes
        </p>
      </div>

      {/* Form */}
      <form
        action={handleCreateTrade}
        className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] space-y-10"
      >
        {/* Market Information */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1E293B] flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E4ED8] flex items-center justify-center text-sm">1</span>
            Market Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="marketType"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Market Type
              </label>
              <select
                id="marketType"
                name="marketType"
                required
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
              >
                <option value="crypto_futures">Crypto Futures</option>
                <option value="crypto_spot">Crypto Spot</option>
                <option value="saham">Saham</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="pair"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Pair / Symbol
              </label>
              <input
                id="pair"
                name="pair"
                type="text"
                required
                placeholder="BTCUSDT, AAPL, BBCA"
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="positionType"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Position
              </label>
              <select
                id="positionType"
                name="positionType"
                required
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
          </div>
        </section>

        {/* Trade Setup */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1E293B] flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E4ED8] flex items-center justify-center text-sm">2</span>
            Trade Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <label
                htmlFor="entryPrice"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
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
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="stopLoss"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
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
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="takeProfit"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
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
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="riskPercentage"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
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
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="positionSize"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
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
                className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-[#1E4ED8] font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              RR Ratio will be calculated automatically from Entry, Stop Loss, and Take Profit.
            </p>
          </div>
        </section>

        {/* Screenshot */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1E293B] flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E4ED8] flex items-center justify-center text-sm">3</span>
            Screenshot
          </h2>

          <div>
            <label
              htmlFor="screenshotEntry"
              className="block text-sm font-semibold text-[#1E293B] mb-2"
            >
              Entry Screenshot URL
            </label>
            <input
              id="screenshotEntry"
              name="screenshotEntry"
              type="url"
              placeholder="https://res.cloudinary.com/..."
              className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
            />
            <p className="text-xs text-[#64748B] mt-3 font-medium">
              Paste your Cloudinary or image hosting URL here.
            </p>
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1E293B] flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E4ED8] flex items-center justify-center text-sm">4</span>
            Notes
          </h2>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="tradingReason"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Trading Reason
              </label>
              <textarea
                id="tradingReason"
                name="tradingReason"
                rows={4}
                placeholder="Why did you take this trade? (e.g. Breakout, Retest, Indicator Signal)"
                className="w-full p-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="psychologyNotes"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Psychology Notes
              </label>
              <textarea
                id="psychologyNotes"
                name="psychologyNotes"
                rows={4}
                placeholder="How was your emotional state before/while entering?"
                className="w-full p-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>
          </div>
        </section>

        {/* Hidden tags placeholder */}
        <input type="hidden" name="tags" value="[]" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-[#E2E8F0]">
          <Link
            href="/journal"
            className="px-6 py-3 text-[#64748B] hover:text-[#1E293B] font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Save Trade
          </button>
        </div>
      </form>
    </div>
  );
}