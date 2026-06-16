import { getTradeById, closeTrade, deleteTrade } from "@/lib/actions/journal.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tradeData = await getTradeById(id);

  if (!tradeData) {
    notFound();
  }

  const { trade, tags } = tradeData;

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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/journal"
            className="text-sm text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
          >
            ← Back to Journal
          </Link>
          <div className="flex items-center gap-4 mt-4">
            <h1 className="text-3xl font-bold text-[#1E293B]">
              {trade.pair}
            </h1>
            <span
              className={`px-4 py-1.5 text-sm font-semibold rounded-xl ${
                trade.positionType === "long"
                  ? "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20"
                  : "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20"
              }`}
            >
              {trade.positionType.toUpperCase()}
            </span>
          </div>
          <p className="text-[#64748B] mt-2 font-medium">
            {formatDate(trade.tradeDate)} • {trade.marketType.replace("_", " ")}
          </p>
        </div>

        {!trade.result && (
          <form action={handleDelete}>
            <button
              type="submit"
              className="px-6 py-3 text-[#EF4444] hover:bg-[#FEE2E2] font-semibold rounded-xl transition-all"
            >
              Delete Trade
            </button>
          </form>
        )}
      </div>

      {/* Trade Setup Details */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h2 className="text-xl font-semibold text-[#1E293B] mb-8">
          Trade Setup
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <DetailItem label="Entry Price" value={trade.entryPrice} />
          <DetailItem label="Stop Loss" value={trade.stopLoss} />
          <DetailItem label="Take Profit" value={trade.takeProfit} />
          <DetailItem label="RR Ratio" value={`${trade.rrRatio}:1`} />
          <DetailItem label="Position Size" value={trade.positionSize} />
          <DetailItem label="Risk %" value={`${trade.riskPercentage}%`} />

          {trade.result && (
            <>
              <div>
                <p className="text-sm text-[#64748B] font-medium mb-2">
                  Result
                </p>
                <span
                  className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-xl ${
                    trade.result === "win"
                      ? "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20"
                      : trade.result === "loss"
                      ? "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20"
                      : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                  }`}
                >
                  {trade.result.toUpperCase()}
                </span>
              </div>

              <div>
                <p className="text-sm text-[#64748B] font-medium mb-2">
                  P&L
                </p>
                <p
                  className={`text-xl font-bold ${
                    trade.profitLoss && parseFloat(trade.profitLoss) > 0
                      ? "text-[#10B981]"
                      : trade.profitLoss && parseFloat(trade.profitLoss) < 0
                      ? "text-[#EF4444]"
                      : "text-[#1E293B]"
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
          <div className="mt-8 pt-8 border-t border-[#E2E8F0]">
            <p className="text-sm text-[#64748B] font-medium mb-4">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-blue-50 text-[#1E4ED8] border border-[#1E4ED8]/20"
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
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold text-[#1E293B] mb-8">
            Screenshots
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trade.screenshotEntry && (
              <div>
                <p className="text-sm text-[#64748B] font-medium mb-4">
                  Entry Screenshot
                </p>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
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
                <p className="text-sm text-[#64748B] font-medium mb-4">
                  Exit Screenshot
                </p>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
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
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold text-[#1E293B] mb-8">
            Notes
          </h2>

          <div className="space-y-8">
            {trade.tradingReason && (
              <div>
                <p className="text-sm font-semibold text-[#64748B] mb-3 uppercase tracking-wider">
                  Trading Reason
                </p>
                <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  <p className="text-[#1E293B] whitespace-pre-wrap leading-relaxed">
                    {trade.tradingReason}
                  </p>
                </div>
              </div>
            )}

            {trade.psychologyNotes && (
              <div>
                <p className="text-sm font-semibold text-[#64748B] mb-3 uppercase tracking-wider">
                  Psychology Notes
                </p>
                <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  <p className="text-[#1E293B] whitespace-pre-wrap leading-relaxed">
                    {trade.psychologyNotes}
                  </p>
                </div>
              </div>
            )}

            {trade.evaluationNotes && (
              <div>
                <p className="text-sm font-semibold text-[#64748B] mb-3 uppercase tracking-wider">
                  Evaluation Notes
                </p>
                <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  <p className="text-[#1E293B] whitespace-pre-wrap leading-relaxed">
                    {trade.evaluationNotes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close Trade Form */}
      {!trade.result && (
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold text-[#1E293B] mb-8">
            Close Trade
          </h2>

          <form action={handleCloseTrade} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="result"
                  className="block text-sm font-semibold text-[#1E293B] mb-2"
                >
                  Result
                </label>
                <select
                  id="result"
                  name="result"
                  required
                  className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] transition-all"
                >
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                  <option value="breakeven">Breakeven</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="profitLoss"
                  className="block text-sm font-semibold text-[#1E293B] mb-2"
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
                  className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="screenshotExit"
                  className="block text-sm font-semibold text-[#1E293B] mb-2"
                >
                  Exit Screenshot URL
                </label>
                <input
                  id="screenshotExit"
                  name="screenshotExit"
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full h-12 px-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="evaluationNotes"
                className="block text-sm font-semibold text-[#1E293B] mb-2"
              >
                Evaluation Notes
              </label>
              <textarea
                id="evaluationNotes"
                name="evaluationNotes"
                rows={4}
                placeholder="What went well? What could be improved?"
                className="w-full p-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:border-transparent bg-white text-[#1E293B] placeholder:text-[#64748B] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all hover:scale-[1.01] shadow-lg hover:shadow-xl"
            >
              Close Trade
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm text-[#64748B] font-medium mb-2">
        {label}
      </p>
      <p className="text-lg font-bold text-[#1E293B]">
        {value}
      </p>
    </div>
  );
}