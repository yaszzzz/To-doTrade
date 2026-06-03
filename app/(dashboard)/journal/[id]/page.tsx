import { getTradeById, closeTrade, deleteTrade } from "@/lib/actions/journal.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function TradeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { trade, tags } = await getTradeById(id);

  async function handleCloseTrade(formData: FormData) {
    "use server";

    const result = formData.get("result") as "win" | "loss" | "breakeven";
    const profitLoss = formData.get("profitLoss") as string;
    const screenshotExit = formData.get("screenshotExit") as string;
    const evaluationNotes = formData.get("evaluationNotes") as string;

    await closeTrade(id, result, profitLoss, screenshotExit, evaluationNotes);
    redirect(`/journal/${id}`);
  }

  async function handleDelete() {
    "use server";

    await deleteTrade(id);
    redirect("/journal");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/journal"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Journal
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {trade.pair}
            </h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                trade.positionType === "long"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {trade.positionType.toUpperCase()}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {formatDate(trade.tradeDate)} • {trade.marketType.replace("_", " ")}
          </p>
        </div>

        {!trade.result && (
          <form action={handleDelete}>
            <button
              type="submit"
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              Delete Trade
            </button>
          </form>
        )}
      </div>

      {/* Trade Setup Details */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          Trade Setup
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Entry Price
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {trade.entryPrice}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Stop Loss
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {trade.stopLoss}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Take Profit
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {trade.takeProfit}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              RR Ratio
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {trade.rrRatio}:1
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Position Size
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {trade.positionSize}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Risk %
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {trade.riskPercentage}%
            </p>
          </div>

          {trade.result && (
            <>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Result
                </p>
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
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  P&L
                </p>
                <p
                  className={`text-lg font-semibold ${
                    trade.profitLoss && parseFloat(trade.profitLoss) > 0
                      ? "text-green-600 dark:text-green-400"
                      : trade.profitLoss && parseFloat(trade.profitLoss) < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-slate-600"
                  }`}
                >
                  {trade.profitLoss
                    ? `${parseFloat(trade.profitLoss) > 0 ? "+" : ""}${formatCurrency(
                        parseFloat(trade.profitLoss)
                      )}`
                    : "-"}
                </p>
              </div>
            </>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Screenshots */}
      {(trade.screenshotEntry || trade.screenshotExit) && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Screenshots
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trade.screenshotEntry && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Entry Screenshot
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                  <Image
                    src={trade.screenshotEntry}
                    alt="Entry screenshot"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {trade.screenshotExit && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Exit Screenshot
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                  <Image
                    src={trade.screenshotExit}
                    alt="Exit screenshot"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {(trade.tradingReason || trade.psychologyNotes || trade.evaluationNotes) && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Notes
          </h2>

          <div className="space-y-6">
            {trade.tradingReason && (
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Trading Reason
                </p>
                <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                  {trade.tradingReason}
                </p>
              </div>
            )}

            {trade.psychologyNotes && (
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Psychology Notes
                </p>
                <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                  {trade.psychologyNotes}
                </p>
              </div>
            )}

            {trade.evaluationNotes && (
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Evaluation Notes
                </p>
                <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                  {trade.evaluationNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close Trade Form */}
      {!trade.result && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Close Trade
          </h2>

          <form action={handleCloseTrade} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="result"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Result
                </label>
                <select
                  id="result"
                  name="result"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                  <option value="breakeven">Breakeven</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="profitLoss"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Profit/Loss ($)
                </label>
                <input
                  id="profitLoss"
                  name="profitLoss"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="screenshotExit"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Exit Screenshot URL
                </label>
                <input
                  id="screenshotExit"
                  name="screenshotExit"
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="evaluationNotes"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Evaluation Notes
              </label>
              <textarea
                id="evaluationNotes"
                name="evaluationNotes"
                rows={4}
                placeholder="What went well? What could be improved?"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Close Trade
            </button>
          </form>
        </div>
      )}
    </div>
  );
}